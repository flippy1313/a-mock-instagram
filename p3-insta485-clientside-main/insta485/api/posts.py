"""REST API for posts."""
import flask
import arrow
# from flask.sessions import NullSession
# from werkzeug.wrappers import request
from insta485.views.utility import validate_password
import insta485


def post_helper(logname, post, cur):
    """Do A dummy docstring."""
    if post is not None:
        ownerimgurl = cur.execute(
            """
              SELECT filename FROM users
              WHERE users.username = ?
              """, (post['owner'], )
        ).fetchone()
        comments = cur.execute(
            """
            SELECT commentid, owner, text FROM comments
            WHERE postid = ?
            """, (post['postid'],)
        ).fetchall()
        for comment in comments:
            comment['lognameOwnsThis'] = bool(comment['owner'] == logname)
            # comment['lognameOwnsThis'] = True\
            #     if logname == comment['owner'] else False
            comment['ownerShowUrl'] = f"/users/{comment['owner']}/"
            comment['url'] = f"/api/v1/comments/{comment['commentid']}/"
        result = {}
        result['comments'] = comments

        post_time = arrow.get(post['created'],
                              'YYYY-MM-DD HH:mm:ss')
        result['created'] = calc_time(post_time)
        result['imgUrl'] = f"/uploads/{post['filename']}"
        result['owner'] = post['owner']
        result['ownerImgUrl'] = f"/uploads/{ownerimgurl['filename']}"
        result['ownerShowUrl'] = f"/users/{post['owner']}/"
        result['postShowUrl'] = f"/posts/{post['postid']}/"
        result['postid'] = post['postid']
        result['url'] = f"/api/v1/posts/{post['postid']}/"
        num_like = cur.execute(
            """
            SELECT COUNT(*) as num FROM likes
            WHERE postid = ?
            ORDER BY postid DESC
            """, (post['postid'],)
        ).fetchone()
        liked = cur.execute(
            """
            SELECT owner, likeid FROM likes
            WHERE owner = ?
            AND postid = ?
            ORDER BY postid DESC
            """, (logname, post['postid'])
        ).fetchone()
        # print("liked:\n\n\n\n")
        # print(liked)
        likes = {}
        likes['lognameLikesThis'] = False
        if liked:
            likes['lognameLikesThis'] = True
        likes['numLikes'] = num_like['num']
        likes['url'] = None
        if likes['lognameLikesThis'] is True:
            likes['url'] = f"/api/v1/likes/{liked['likeid']}/"
        result['likes'] = likes
    else:
        return flask.abort(404)
    return result


@insta485.app.route('/api/v1/posts/')
def get_post():
    """Return post."""
    logname = auth()
    connection = insta485.model.get_db()
    cur = connection.cursor()
    results = []

    limit = flask.request.args.get("size", default=10, type=int)
    page = flask.request.args.get("page", default=0, type=int)
    postid_lte = flask.request.args.get("postid_lte", default=0, type=int)

    if page < 0 or limit < 0:
        return flask.abort(400)

    offset = page*limit
    print(postid_lte)
    print(page)
    print(limit)
    print(offset)

    if postid_lte != 0:
        posts = cur.execute(
            """
            SELECT Distinct postid FROM posts
            LEFT JOIN following ON posts.owner = following.username2
            WHERE ((following.username1 = ? OR posts.owner = ?)
            AND posts.postid <= ?)
            ORDER BY posts.postid DESC
            LIMIT ? OFFSET ?
            """, (logname, logname, postid_lte, limit, offset)
        ).fetchall()
    else:
        posts = cur.execute(
            """
            SELECT Distinct postid FROM posts
            LEFT JOIN following ON posts.owner = following.username2
            WHERE (following.username1 = ? OR posts.owner = ?)
            ORDER BY posts.postid DESC
            LIMIT ? OFFSET ?
            """, (logname, logname, limit, offset)
        ).fetchall()
    p_p = []

    for p_snake in posts:
        p_p.append(cur.execute(
            """
            SELECT postid, filename, owner, created,
            COUNT(postid) AS total FROM posts
            WHERE postid = ?
            """, (p_snake['postid'],)
        ).fetchall())
        # print(type(p_p))
    if posts is not None:
        for post in p_p:
            for p_snake in post:
                results.append(post_helper(logname, p_snake, cur))

    next_link = ""
    if not (len(posts) < limit or len(posts) == 0):
        nite = max(postid_lte, posts[0]['postid'])
        next_link = \
            f"/api/v1/posts/?size={limit}&page={page+1}&postid_lte={nite}"
    if flask.request.full_path[-1] == '?':
        flask.request.full_path = flask.request.full_path[:-1]
    context = {
        "next": next_link,
        "results": results,
        "url": flask.request.full_path,
    }
    return flask.jsonify(**context)


@insta485.app.route('/api/v1/posts/<int:postid_url_slug>/')
def get_one_post(postid_url_slug):
    """Do A dummy docstring."""
    logname = auth()
    connection = insta485.model.get_db()
    cur = connection.cursor()
    post = cur.execute(
        '''SELECT postid, filename, owner, created FROM posts
        WHERE postid = ?
        ''', (postid_url_slug,)
    ).fetchone()

    return flask.jsonify(**post_helper(logname, post, cur))


def calc_time(post_time):
    """Do A dummy docstring."""
    diff = arrow.now() - post_time
    days = diff.days
    hours, remainder = divmod(diff.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    if days > 0:
        return post_time.shift(days=-1).humanize()
    if hours > 0:
        return post_time.shift(hours=-1).humanize()
    if minutes > 0:
        return post_time.shift(minutes=-1).humanize()
    if seconds > 0:
        return post_time.shift(seconds=-1).humanize()
    return "just now"


def auth():
    """Do A dummy docstring."""
    if flask.request.authorization is not None:
        logname = flask.request.authorization['username']
        p_w = flask.request.authorization['password']
        validate_password(logname, p_w)
        return logname
    if "username" not in flask.session:
        return flask.abort(403)
    logname = flask.session['username']
    return logname
