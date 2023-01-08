from flask import current_app as app, request, make_response, jsonify
from models.users import db, User

# register
@app.route('/authen/register/', methods=['POST'])
def register_user():
    """Create an account."""
    data = request.get_json()
    email = data['email']
    password = data['password']
    if email and password:
        new_user = User(email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user)
    else:
        return make_response(f"Email or password can't be null!")

# login 
@app.route('/authen/login/', methods=['POST'])
def login_user():
    data = request.get_json()
    email_db = data['email']
    password_db = data['password']
    user_db = User.query.get(email_db)
    del user_db.__dict__['_sa_instance_state']
    if user_db is not None:
            if password_db != user_db.password:
               return make_response(f"Invalid Email or password !")
            return jsonify(user_db.__dict__)