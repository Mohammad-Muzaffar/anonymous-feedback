# Anonymous Feedback a Simple NextJS Project (Under Development) 

## Basic System Design:

![image](https://github.com/user-attachments/assets/38457569-a7e2-4140-8583-1db8395af5a2)


## Setup locally:

1. Git clone:
```bash
    git clone https://github.com/Mohammad-Muzaffar/anonymous-feedback.git
```

2. Install dependency:
```bash
    cd anonymous-feedback
    npm install
```

3. Create a docker volume only first time setting up the project:
```bash
    sudo docker volume create mongodb_data
```

4. Start a docker container with mongoDB:
```bash
    sudo docker run -d \
    --name anonymous_feedback \
    -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
    -e MONGO_INITDB_ROOT_PASSWORD=mongopasswd \
    -v mongodb_data:/data/db \
    -p 27017:27017 \
    mongo
```

5. Create a .env file in the root directory and paste the content of .env.example and replace the environment variables with your own:
```bash
    cp .env.example .env
```
