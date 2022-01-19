from backend import app

@app.route('/api')
@app.route("/api/index")
def index():
    user = {'username': 'Miguel'}
    return '''
            <html>
                <head>
                    <title>Home Page - Microblog</title>
                </head>
                <body>
                    <h1>Hello, ''' + user['username'] + '''!</h1>
                </body>
            </html>'''