# Anonymous Feedback

A **Next.js** platform where users can create posts/questions/opinions and share a unique link to gather honest and anonymous feedback. The platform utilizes analytics powered by **OpenAI models** to provide insights on feedback, enabling users to make informed decisions based on true, unbiased responses.  

> **Warning**
> This app is a work in progress. I'm building this in public. 
---

## Features ✨  
- **Post Creation**: Users can log in and create posts or questions.  
- **Shareable Link**: Generate unique links for each post to share with others.  
- **Anonymous Feedback**: Anyone with the link can submit feedback anonymously without the need to log in.  
- **Interactive Engagement**: Posts can be liked, disliked, and receive feedback displayed in a comments section.  
- **Feedback Analytics**: Leverage **OpenAI models** to analyze feedback and provide actionable insights.  
- **Modern UI**: Built using **shadcn/ui** for a clean and responsive user experience.  

---

## Tech Stack 🛠️  
- **Frontend - Backend**: [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind](https://tailwindcss.com/)   
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)  
- **Database**: [MongoDB](https://www.mongodb.com/)  
- **Email Service**: [Render.com](https://render.com/)  
- **UI Components**: [shadcn/ui](https://shadcn.dev/)  
- **AI Integration**: [OpenAI API](https://openai.com/api/)  

---

## High-Level System Design 📊  
![High-Level Design](https://github.com/user-attachments/assets/af8d5c63-e1b7-497e-b00f-c1d67245a68e)

---

## Setup Locally 🖥️  

### Prerequisites:  
- [Node.js](https://nodejs.org/) installed on your system  
- [Docker](https://www.docker.com/) installed and running  

### Steps:  
**1. Clone the repository**:  
   ```bash  
   git clone https://github.com/Mohammad-Muzaffar/anonymous-feedback.git  
   ```
**2. Navigate to the project directory**:
   ```bash  
   cd anonymous-feedback  
   ```
**3. Install dependencies**:
   ```bash  
   npm install  
   ```
**4. Create a Docker volume**: (Only required during initial setup)
   ```bash  
   sudo docker volume create mongodb_data  
   ```
**5. Start MongoDB in a Docker container**:
   ```bash  
   sudo docker run -d -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=mongopasswd -v mongodb_data:/data/db -p 27017:27017 mongo  
   ```
**6. Set up environment variables**: 
Create a `.env` file in the root directory and populate it using `.env.example` use your own `API_KEY's`:
   ```bash  
   cp .env.example .env  
   ```
**7. Run the development server**:
   ```bash  
   npm run dev  
   ```
**8. Access the app**:

Open [localhost tab](http://localhost:3000) in your browser.

---

## Contribution Guidelines 🤝  
We welcome contributions to make **Anonymous Feedback** even better! Here's how you can contribute:  

- **Fork the repository**: Click the "Fork" button on the top-right corner of the repository page.  

- **Clone your forked repository**: Download the repository to your local machine.  

- **Create a new branch**: Use a descriptive branch name for your feature or fix.  

- **Implement changes**: Ensure your code is clean, well-documented, and follows the project's guidelines.  

- **Test your changes**: Verify that everything works as expected and does not break existing functionality.  

- **Commit your changes**: Write clear and concise commit messages to explain your modifications.  

- **Push to your branch**: Upload your changes to your forked repository.  

- **Submit a Pull Request**: Navigate to the original repository, create a "New Pull Request," and provide a detailed description of your changes.  

---

## Stay Connected 💬  
For questions, suggestions, or discussions, feel free to reach out!  
- **GitHub Issues**: Create an Issue on the repository page.  
- **Email**: muzaffarsha825@gmail.com  

---

## Acknowledgements 🏆  
We extend our gratitude to the following individuals for their inspiration and guidance:  
- [Hitesh Choudhary](https://github.com/hiteshchoudhary)  for the idea.
- [Harkirat Singh](https://github.com/hkirat) for motivation.  

---

## Authors ✍️  
This project is maintained and developed by:  
- [@muzaffarshaikh](https://github.com/Mohammad-Muzaffar)  
