from flask import Flask, jsonify, flash, request, redirect, url_for, render_template, send_from_directory
from flask import current_app as app, request, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
import os
from os.path import join, dirname, realpath
from werkzeug.utils import secure_filename

# config app
UPLOAD_FOLDER = './static/images'
app = Flask(__name__, static_folder='./static')
cors = CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
db = SQLAlchemy(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#============ MODELS ================
# User
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )
    email = db.Column(db.String(), unique=True, nullable=False)
    password = db.Column(db.String(), nullable=False)

    def __init__(self, email, password):
        self.email = email
        self.password = password

# Post
class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    # path to current image in static folder, show when user_id != id
    image_path = db.Column(db.String(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # store the value of the annotatioan as list of [x1,y1/x2,y2]
    annotation_path = db.Column(db.String(), nullable=False)

    def __init__(self, image_path, user_id, annotation_path):
        self.image_path = image_path 
        self.user_id = user_id 
        self.annotation_path = annotation_path 

# db.drop_all()
db.create_all()
# End

# ===================== Controllers & Routes =======================
# home routr
@app.route("/init")
def home():
    return jsonify(
        {
            "status": "Tam on the road",
        }
    )
@app.route('/static/<path:path>')
def static_files(path):
    return send_from_directory(url_for('static', filename="/images/"+path), "/images/"+path)

# find all users
@app.route('/users/find/all', methods=['GET'])
def get_users():
    users = []
    for user in db.session.query(User).all():
        users.append(user)
    return jsonify({"data": [{"id": user.id, "email": user.email, "password": user.password} for user in users]})

# find a user by email
@app.route('/users/find/email/<email>', methods=['GET'])
def find_user_email(email):
    user = User.query.filter_by(email=email).first()
    del user.__dict__['_sa_instance_state']
    return jsonify(user.__dict__)

# find a user by id
@app.route('/users/find/id/<id>', methods=['GET'])
def find_user_id(id):
    user = User.query.get(id)
    del user.__dict__['_sa_instance_state']
    return jsonify(user.__dict__)

# register
@app.route('/authen/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data['email']
    password = data['password']
    if email and password:
        new_user = User(email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({new_user.id: [{"email": new_user.email, "password": new_user.password}]})
    else:
        return make_response(f"Email or password can't be null!")

# login 
@app.route('/authen/login', methods=['GET', 'POST'])
def login_user():
    data = request.get_json()
    email_db = data['email']
    password_db = data['password']
    user_db = User.query.filter_by(email=email_db).first()
    del user_db.__dict__['_sa_instance_state']
    if user_db is not None:
            if password_db != user_db.password:
               return make_response(f"Invalid Email or password !")
            return jsonify(user_db.__dict__)

# find post
@app.route('/posts/find/<id>', methods=['GET'])
def find_post(id):
    post = Post.query.get(id)
    del post.__dict__['_sa_instance_state']
    return jsonify(post.__dict__)

# find all posts
@app.route('/posts/find/all', methods=['GET'])
def get_posts():
    posts = []
    for post in db.session.query(Post).all():
        del post.__dict__['_sa_instance_state']
        posts.append(post.__dict__)
    return jsonify(posts)

# creat a post
@app.route('/posts/create', methods=['GET', 'POST'])
def upload():
    data = request.get_json()
    image_path = data['image_path']
    user_id = data['user_id']
    annotation_path = data['annotation_path']
    newPost = Post(image_path=image_path, user_id=user_id, annotation_path=annotation_path)
    db.session.add(newPost)
    db.session.commit()
    return jsonify({newPost.id: [{"image_path": newPost.image_path, "user_id": newPost.user_id, "annotation_path": newPost.annotation_path}]})

# upload image
@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    fileName = request.form['filename']
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], fileName))
    return os.path.join(app.config['UPLOAD_FOLDER'], fileName)

# update annotation to post
@app.route('/posts/update/<id>', methods = ['PUT'])
def update_annotation(id):
    body = request.get_json()
    post = Post.query.get(id) 
    x = body['x']
    y = body['y']  
    new_annotation = post.annotation_path+'/'+x+','+y
    db.session.query(Post).filter_by(id=id).update(dict(annotation_path=new_annotation))
    db.session.commit()
    return jsonify({post.id: [{"image_path": post.image_path, "user_id": post.user_id, "annotation_path": post.annotation_path}]})

def check_upload_dir():
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

if __name__ == '__main__':
    check_upload_dir()
    app.run(debug=True)
