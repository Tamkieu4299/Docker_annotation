from models.posts import db, Post
from flask import Flask, request
from flask import current_app as app, request, make_response, jsonify

# find post
@app.route('/posts/find/<id>', methods=['GET'])
def find_post(id):
    post = Post.query.get(id)
    del Post.__dict__['_sa_instance_state']
    return jsonify(Post.__dict__)

# find all posts
@app.route('/posts/find/all', methods=['GET'])
def get_posts():
    posts = []
    for post in db.session.query(Post).all():
        del Post.__dict__['_sa_instance_state']
        posts.append(post.__dict__)
    return jsonify(posts)

#  upload
@app.route('/posts/create/<id>', methods=['GET', 'POST'])
def upload(id):
    data = request.get_json()
    image_path = data['image_path']
    user_id = id
    newPost = Post(image_path=image_path, user_id=user_id, annotation_path="")
    db.session.add(newPost)
    db.session.commit()

# annotation path
