# Callhacks 11.0 Project 
Team: Pari, David, Sriman, Anishka
## Inspiration
With a variety of language learning resources out there, we set out to create a tool that can help us practice a part of language that keeps things flowing -- conversation! LanguaLine aims to empower users to speak their foreign language by helping them develop their conversational skills. 

## What it does
We wanted to create an interface that can help users practice speaking a foreign language. Through LanguaLine, users can: 
- Select a language they wish to practice speaking in
- Select how "motivating" they want their Mentor to be (Basic is normal, Extra Motivation is a tough love approach). 
- Enter their phone number and receive a call from our AI Mentor
- Answer questions posed by the Mentor 
- Receive real-time feedback about their performance and a generalized report on strengths and weakensses
- View a transcript and summary of the call after the conversation is completed

## How we built it
We used ```React.js``` for our frontend, and ```Firebase``` for our database. To style our components, we utilized ```TailwindCSS``` and ```React MaterialUI```. 

To create, tune, and prompt engineer our AI Mentor, we used the **VAPI.ai** API. Our **transcriber model** is **Deepgram's nova-2 multi** model and our **model** is **gpt-4o-mini** provided by **Open.AI**.  Our Mentor's voice is **Alloy**, also provided by Open.AI. 

We also are using **Gemini** to analyze users' call transcripts and generate a report identifying strengths and weaknesses in their speaking skills. 

## Challenges we ran into
Our biggest challenge was understanding the VAPI documentation, as it was our first time working with a voice AI API. We had to make a few changes to our project stack to accommodate for VAPI, including only making client-side API calls, unlike our original plan of using ```Express.js```.  

We also faced challenges prompt engineering our Mentor for the Basic and Extra Motivating modes, as well as accounting for external interferences like background noises. 
## Accomplishments that we're proud of
The turning point in our development process was when we were able to start conversing with our Mentor. After this was solidified, our project trajectory only went upwards. We're proud of the fact we were able to turn this idea into an operational and functional application. 

## What we learned
The team behind LanguaLine had a variety of skill levels; for some, this was their first project using this tech stack, while for others, this was familiar. Some of us mastered the ability to send API calls and parse JSON data. Some of us also learned how to prompt engineer for a particular language choice. There were lessons being learned all throughout the 36 hours of development, which helped us feel connected to the project and motivated to keep creating. 

## What's next for LanguaLine
We plan to offer **more variation** in the Mentors we offer. Right now, we only offer Mentors based off of a language choice and motivation level. In the future, we plan to include language difficulties, personalities, greater language support, custom prompts, and scheduled calling. 

We also plan to offer improvement plans for grammar, pronunciation, and vocabulary, as well as a scoring system for users' performances during Mentor sessions. 
