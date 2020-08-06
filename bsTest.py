import requests
import re
from bs4 import BeautifulSoup

problemNumber = 1027
problemURL = 'https://www.acmicpc.net/problem/' + str(problemNumber)
req = requests.get(problemURL)
problemHTML = req.text
soup = BeautifulSoup(problemHTML, 'html.parser')

# problem_title = soup.select(
#     'body > div.wrapper > div.container.content > div.row > div:nth-child(3) > div > h1 > span.printable'
# )

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

time_limit = problem_header[2]
memory_limit = problem_header[4]
num_of_submit = problem_header[6]
num_of_correct = problem_header[8]
num_of_correct_user = problem_header[10]
correct_rate = problem_header[12]

# time_limit = re.sub('<[^<>]*>', '', str(soup.select(
#     '#problem-info > tbody > tr > td:nth-child(1)'
# )[0]))

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

print(type(problem_header[0]))

