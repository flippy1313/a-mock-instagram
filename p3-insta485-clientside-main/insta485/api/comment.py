"""REST API for comments."""
import flask
import insta485
from insta485.api.posts import auth


@insta485.app.route('/api/v1/comments/', methods=['POST'])
def comment():
    """Post comments."""
    logname = auth()
    connection = insta485.model.get_db()
    cur = connection.cursor()
    post_id = flask.request.args['postid']
    comment_json = flask.request.get_json()
    text = comment_json["text"]
    cur.execute(
        "INSERT INTO comments (owner, postid, text)"
        "VALUES (?,?,?)", (logname, post_id, text)
    )
    commentid = cur.execute(
        "SELECT last_insert_rowid() AS id FROM comments"
    ).fetchone()
    context = {
        "commentid": commentid['id'],
        "lognameOwnsThis": True,
        "owner": logname,
        # "ownerShowUrl": "/users/{}/".format(logname),
        "ownerShowUrl": f"/users/{logname}/",
        "text": text,
        # "url": "/api/v1/comments/{}/".format(commentid['id'])
        "url": f"/api/v1/comments/{commentid['id']}/"
    }
    return flask.jsonify(**context), 201


@insta485.app.route('/api/v1/comments/<int:commentid>/', methods=['DELETE'])
def delete_com(commentid):
    """DELETE comments."""
    connection = insta485.model.get_db()
    cur = connection.cursor()
    cur.execute(
        """
        DELETE FROM comments
        WHERE commentid = ?
        """, (commentid,)
    )
    return "", 204
