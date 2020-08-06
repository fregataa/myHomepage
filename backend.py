import random
import requests
import re
import json
from flask import Flask
from selenium import webdriver
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)
# CORS(app, resources={r'*':{'origins':'http://localhost'}})
CORS(app)

@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/assign-problem', methods=['POST'])
def assignProblem(): 
    # chromedriver_dir = r'C:\Users\win10\Desktop\nodejs\myHomepage\chromedriver.exe'
    # driver = webdriver.Chrome(chromedriver_dir)
    # driver.get('https://www.acmicpc.net/')
    # problemNumber = 1000
    randomAllProblemNumber = random.randrange(1000, 19529)
    problemURL = 'https://www.acmicpc.net/problem/' + str(randomAllProblemNumber)
    req = requests.get(problemURL)
    problemHTML = req.text
    # header = req.headers
    # status = req.status_code
    # isHttpOk = req.ok
    soup = BeautifulSoup(problemHTML, 'html.parser')
        
    problemNumberPart = soup(
        'span'
    )
    numberRegex = re.compile(r'\d+')
    problem_number = numberRegex.search(str(problemNumberPart[2])).group(0)

    problemTitlePart = soup.select(
        '#problem_title'
    )[0]

    problem_title = re.sub('<[^<>]*>', '', str(problemTitlePart))

    #problem-info > tbody > tr > td:nth-child(1) # 시간 제한

    # timeLimitPart = soup.select(
    #     '#problem-info > tbody > tr > td:nth-child(1)'
    # )[0]

    problemHeaderPart = soup.select(
        '#problem-info > tbody > tr'
    )[0]

    problem_header = re.split('<[^<>]*>', str(problemHeaderPart))
    while '' in problem_header:
        problem_header.remove('')
    while '\n' in problem_header:
        problem_header.remove('\n')

    problem_description = re.sub('<[^<>]*>', '', str(soup.select(
        '#problem_description > p'
    )[0])) 

    problem_input = re.sub('<[^<>]*>', '', str(soup.select(
        '#problem_input > p'
    )[0])) 

    problem_output = re.sub('<[^<>]*>', '', str(soup.select(
        '#problem_output > p'
    )[0])) 

    problem_url = problemURL

    problem_data = {
        "problem_number" : problem_number,
        "problem_title" : problem_title,
        "problem_header" : problem_header,
        "problem_description" : problem_description,
        "problem_input" : problem_input,
        "problem_output" : problem_output,
        "problem_url" : problem_url
    }

    # myHomepageURL = 'http://localhost:7100/?item=Algorithm'
    # response = requests.post(myHomepageURL, data=json.dumps(data))
    return problem_data

if __name__ == '__main__':
    app.run()