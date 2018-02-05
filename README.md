# Organization Chart

Display an organization chart. Click on the employees to update his or her name, title, rank, or supervisor.
Supervisor to employee is a one to many relationship, and supervisors must have a rank greater than or equal to each
reporting employee.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

#### Running via Docker
* [Docker](https://docs.docker.com/install/)
* [Docker-Compose](https://docs.docker.com/compose/install/)

#### Running Locally
* [Python 3](https://www.python.org/downloads/release/python-364/)
* [pip 9](https://pip.pypa.io/en/stable/installing/)
* [Virtualenv](https://virtualenv.pypa.io/en/stable/installation/)
* [Node 8](https://nodejs.org/en/download/)

### Installing

#### Run via Docker

Clone the repository:
```
git clone https://github.com/drogina/orgtree.git
```
In terminal:
```
cd /path/to/your/orgtree/frontend
npm install
cd ..
docker-compose up
```
Access the application via `http://localhost:3000`


#### Run Locally

Clone the repository:
```
git clone https://github.com/drogina/orgtree.git
```
In terminal, navigate to your repo:
```
cd /path/to/your/orgtree
python3 -m venv ./venv
source ./venv/bin/activate
pip install -r ./requirements.txt
python3 manage.py runserver
```
Open a separate terminal window:
```
cd /path/to/your/orgtree/frontend
npm install
npm start
```

Access the frontend application via `http://localhost:3000`

End with an example of getting some data out of the system or using it for a little demo

## Built With

* [**Python 3**](https://www.python.org/)
* [**Django 2**](https://www.djangoproject.com/) + [**Django Rest Framework 3**](http://www.django-rest-framework.org/)
* [**React**](https://reactjs.org/)
* [**Webpack**](https://webpack.js.org/)
* [**Sass**](https://sass-lang.com/) 
* [**Bootstrap 4**](https://getbootstrap.com/)

## Authors

**Debbie Rogina**


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
