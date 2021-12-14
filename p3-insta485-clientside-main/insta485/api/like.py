"""REST api for likes."""
import flask
import insta485
from insta485.api.posts import auth


@insta485.app.route('/api/v1/likes/', methods=["POST"])
def get_like():
    """Create a like."""
    logname = auth()
    connection = insta485.model.get_db()
    cur = connection.cursor()
    post_id = flask.request.args['postid']
    exist = cur.execute(
        """
        SELECT CASE
        WHEN EXISTS (
            SELECT * FROM likes
            WHERE owner = ? AND postid = ?
        ) THEN 1
        ELSE 0
        END AS exist
        """, (logname, post_id)
    ).fetchone()
    if exist['exist'] == 1:
        context = {
            "message": "Conflict",
            "status_code": 409
        }
        return flask.jsonify(**context), 409
    cur.execute(
        """
        INSERT INTO likes (owner, postid)
        VALUES (?,?)
        """, (logname, post_id)
    )
    likeid = cur.execute(
        """
        SELECT likeid FROM likes
        WHERE owner = ? AND postid = ?
        """, (logname, post_id)
    ).fetchone()
    context = {
        "likeid": likeid["likeid"],
        "url": f"/api/v1/likes/{likeid['likeid']}/"
    }
    return flask.jsonify(**context), 201


@insta485.app.route('/api/v1/likes/<int:likeid>/', methods=['DELETE'])
def delete_like(likeid):
    """Delete like."""
    # logname = auth()
    connection = insta485.model.get_db()
    cur = connection.cursor()
    cur.execute(
        """
        DELETE FROM likes
        WHERE likeid = ?
        """, (likeid,)
    )
    return "", 204


@insta485.app.route('/api/v1/likes/?postid=<int:postid>',
                    methods=['GET', 'POST'])
def add_like(postid):
    """Add like."""
    logname = auth()

    connection = insta485.model.get_db()
    cur = connection.cursor()
    exist = cur.execute(
        """
        SELECT CASE
        WHEN EXISTS (
            SELECT * FROM like
            WHERE username = ? AND postid = ?
        ) THEN 1
        ELSE 0
        END AS exist
        """, (logname, postid)
    ).fetchone()
    if exist['exist'] == 1:
        context = {
            "message": "Conflict",
            "status_code": 409
        }
        return flask.jsonify(**context), 409
    cur.execute(
        """
        INSERT INTO likes (owner, postid)
        VALUES (?,?)
        """, (logname, postid)
    )
    likeid = cur.execute(
        """
        SELECT likeid FROM likes
        WHERE owner = ? AND postid = ?
        """, (logname, postid)
    ).fetchone()
    context = {
        "likeid": likeid["likeid"],
        "url": f"/api/v1/likes/{likeid['likeid']}/"
    }
    return flask.jsonify(**context), 204
