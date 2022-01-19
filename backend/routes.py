import time
from backend import app

@app.route('/api')
@app.route("/api/time")
def get_current_time():
    return {'time': time.time()}