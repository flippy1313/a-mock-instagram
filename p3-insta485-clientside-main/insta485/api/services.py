"""REST API for services."""
import flask
import insta485


@insta485.app.route('/api/v1/', methods=["GET"])
def get_service():
    """Return address."""
    context = {
        "comments": "/api/v1/comments/",
        "likes": "/api/v1/likes/",
        "posts": "/api/v1/posts/",
        "url": "/api/v1/"
    }
    return flask.jsonify(**context), 200
