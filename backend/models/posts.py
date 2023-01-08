from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()


class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
        unique=True
    )

    # path to current image in static folder, show when user_id != id
    image_path = db.Column(db.String(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # path to annotation image in static folder, show when user_id == id
    annotation_path = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return f"<User {self.id}, {self.image_file}, {self.user_id}, {self.annotation_path}>"

db.create_all()