from flask import current_app as app, request, make_response, jsonify
from models.users import db, User

# register
# @app.route('/users/register/', methods=['POST'])
# def create_user():
#     """Create an account."""
#     data = request.get_json()
#     email = data['email']
#     password = data['password']
#     if email and password:
#         new_user = User(email=email, password=password)
#         db.session.add(new_user)
#         db.session.commit()
#         return make_response(f"{new_user} successfully created!")
#     else:
#         return make_response(f"Email or password can't be null!")

# find a user
@app.route('/users/find/<email>', methods=['GET'])
def find_user(email):
    user = User.query.get(email)
    del user.__dict__['_sa_instance_state']
    return jsonify(user.__dict__)
