# KickStartSoccer

### Making soccer practice planning easier for youth coaches

## About the Project

I've been playing soccer for many years, and I also started helping coach younger kids in U6 and U7 recreational soccer, While coaching, I realized that planning practices isn't always easy, especially when you're trying to keep younger kids interested while also teaching them basic soccer skills.

That's what gave me the idea for **KickStartSoccer**.

I wanted to build a simple app where coaches could find drills, put together practice plans, and organize their soccer season without having to spend too much time figuring out what to do each week.

I'm also interested in coding and engineering, so I thought this would be a fun way to combine two things I enjoy: soccer and technology.

## Demo

KickStartSoccer is a functional youth soccer coaching app built with
Ionic/Angular and Spring Boot.

[Watch the 90-second demo](https://github.com/SidSoccer17/KickStartSoccer/docs/)

Pilot/user rollout is planned for Nov–Dec 2026.

## What I've Built So Far

The app currently lets coaches:

- **Find soccer drills:** Browse drills for dribbling, passing, shooting, and small-sided games.
- **Search and filter:** Find drills based on age group, skill, or keywords.
- **View drill instructions:** See how to set up a drill, what equipment is needed, and tips for running it.
- **Create practice plans:** Pick different drills and save them as a practice session.
- **Plan a season:** Organize practices across multiple weeks and assign drills to each session.
- **Save plans:** Keep practice plans in the browser so coaches can come back to them later on the same device.

My main focus has been keeping the app simple enough for volunteer coaches who may not have much coaching experience.

## How I Built It

I wanted to challenge myself by building both the frontend and backend instead of just making a website with a few pages.

Here's what I used:

- **Java 21 and Spring Boot:** For the backend API that provides the soccer drills.
- **Ionic and Angular:** For building the screens and making the app interactive.
- **HTML, CSS, and TypeScript:** For the layout, design, and frontend functionality.
- **Browser local storage:** For saving practice plans and season schedules.

I worked on getting the frontend and backend to communicate so that coaches could actually browse drills and create plans.

## Project Structure


```text
KickStartSoccer/
├── README.md
├── kickstart-soccer-api/  # Java Spring Boot backend
├── kickstart-soccer-web/  # Ionic Angular frontend
└── .gitignore
```


## Running the App

The project has two parts: the backend and the frontend.

### 1. Start the Backend

Open a terminal and run:

```bash
cd kickstart-soccer-api
./mvnw spring-boot:run
```

The backend provides the drill information through these API endpoints:

```http
GET /api/health
GET /api/drills
GET /api/drills/categories
GET /api/drills/{id}
GET /api/drills/curriculum/{curriculumId}
```

### 2. Start the Frontend

Open another terminal and run:

```bash
cd kickstart-soccer-web
npm install
npm start
```

Once both are running, open the app in your browser to explore the drills, create practice plans, and organize a season.

## What I Learned

Working on KickStartSoccer has helped me understand what goes into building an actual application.

I learned how to:

- Build a backend using Java and Spring Boot.
- Create a frontend using Angular and Ionic.
- Connect the frontend to backend APIs.
- Organize data and display it in the app.
- Save information locally so users don't lose their practice plans.
- Break a bigger project into smaller pieces and work through problems along the way.

One thing I realized is that getting different parts of an application to work together takes more effort than I originally expected. But figuring things out as I went along has been one of the most interesting parts of this project.

## What's Next?

The app is still a work in progress. I've built the main features and have been testing them locally, but I haven't released it for coaches to use yet.

Some things I want to work on next are:

- Test the app with actual youth soccer coaches and get their feedback.
- Add more drills for different age groups and skill levels.
- Make it easier to change and update saved practice plans.
- Improve the season planning features.
- Make the app easier to use on phones and tablets.

My next goal is to try the app with coaches and see whether it actually helps them plan their practices.

## Why This Project Matters to Me

Soccer has been a big part of my life, and coaching younger kids has given me a different perspective on the game.

I know how much time volunteer coaches put into helping kids learn, and I wanted to create something that could make their job a little easier.

KickStartSoccer is still something I'm learning and improving as I go. I'm hoping to eventually make it useful for coaches in my local soccer community.