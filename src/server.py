from flask import Flask, jsonify, request
import json
import os
import psycopg2
import psycopg2.extras

from flask_cors import CORS, cross_origin

# Create a Flask server.
app = Flask(__name__)

CORS(app)

conn = psycopg2.connect('postgresql://laiweiquan1227:VV5FuDfdgCEeMtbb5rKKng@free-tier14.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dheavy-primate-5829')

cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

# cursor.execute(
# """
# CREATE TABLE ScratchBlock (
#     id STRING, 
#     source_code STRING
# )
# """
# )

def input_data():
    num1 = "1"
    code1 = """
    int main(){
        cout << "wtf" << endl;
    }
    """
    num2 = "2"
    code2 = """
    int main(){
        int a = 9;
    }
    """
    cursor.execute("INSERT INTO ScratchBlock(id, source_code) VALUES (%s, %s)",(num1, code1))
    cursor.execute("INSERT INTO ScratchBlock(id, source_code) VALUES (%s, %s)",(num2, code2))
    conn.commit()



def db_get_all():
    cursor.execute('SELECT * FROM ScratchBlock')
    results = cursor.fetchall()
    return results

def db_get_by_id(id):
    cursor.execute('SELECT source_code FROM ScratchBlock WHERE id = %s', (id, ))
    result = cursor.fetchone()
    return result['source_code']

@app.route("/<id>", methods=['GET'])
def get_by_id(id):
    airbnb = db_get_by_id(id)
    if not airbnb:
        return jsonify({"error": "invalid id", "code": 404})
    return jsonify(airbnb)

@app.route("/insert", methods=['GET','POST'])
def go():
    id = request.json['id']
    code = request.json['code']
    cursor.execute("INSERT INTO ScratchBlock(id, source_code) VALUES (%s, %s)",(id, code))
    conn.commit()
    return "success"


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=1001)
