'use client';

import Text from './components/Text'
import Button from './components/Button'
import CircleImage from './components/CircleImage'
import ResumeItem from './components/ResumeItem';
import Education from './components/Education';
import SkillIcon from './components/SkillIcon';
import TopCanvas from './components/TopCanvas';
import ThreeDCanvas from './components/ThreeDCanvas';
import BottomCanvas from './components/BottomCanvas';

export default function Home() {
  const scrollToElement = () => {
    const element = document.getElementById('resume');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const jobs = [
    {
      company: "Amazon",
      location: "Seattle, WA",
      logo: "logos/amazon.png",
      experiences: [
        {
          "time": "Summer 2023",
          position: "Software Dev Engineer Intern - Amazon Connections",
          description: [
            "Created a feature to collect a new type of data point for the Connections team regarding high profile employees at the company. The new feature was integrated and pushed into production. (Java, React, AWS)"
          ]
        },
        {
          "time": "Summer 2022",
          position: "Software Dev Engineer Intern - Amazon Connections",
          description: [
            "Worked to create a component for the core Amazon Connections platform. Developed a tool to expose metrics that indicate the progress and health of internal research campaigns. (Java, React, AWS)"
          ]
        }
      ]
    },
    {
      company: "Bluestamp Engineering",
      location: "Remote",
      logo: "logos/bse.png",
      link: "https://bluestampengineering.com/",
      experiences: [
        {
          "time": "Summer 2021 - Spring 2022",
          position: "Program Director",
          description: [
            "Coordinated enrollment, procurement and distribution of equipment for 125 students. Managed a team of 11 instructors."
          ]
        },
        {
          "time": "Summer 2020",
          position: "Instructor",
          description: [
            "Guided multiple classes of students (approximately four students per class) through electrical engineering and soware development projects. Taught students and managed projects involving numerous technologies such as Arduino, Raspberry Pi, Unity3D, and more."
          ]
        }
      ]
    },
    {
      company: "Autofleet",
      location: "Tel Aviv, Israel",
      logo: "logos/autofleet.png",
      link: "https://autofleet.io/",
      experiences: [
        {
          "time": "October 2018 - April 2019",
          position: "Full Stack Developer Co-Op",
          description: [
            "Developed an adapter and improved changes to the core codebase to allow integration between Autofleet services and a large ride sharing company in preparation for a pilot. (Node.js / Kubernetes / MySQL / RabbitMQ)",
            "Worked closely with the CEO, CTO as well as the other developers to prepare the company for product launch"
          ]
        }
      ]
    },
    {
      company: "BGC Partners",
      location: "NYC, NY",
      logo: "logos/bgc.png",
      link: "https://www.bgcg.com/",
      experiences: [
        {
          "time": "Summer 2019",
          position: "Full Stack Developer Intern",
          description: [
            "Introduced and developed an agile workflow with continuous integration, deployment with Docker / Kubernetes support for application codebases. (Java / Node.js / Git / Jenkins / Docker / Kubernetes)",
            "Developed a new launchpad for FENICS, an electronic trading platform. The new launchpad integrates real time market data, news, and streamlines the user experience when launching the trading applications. (Node.js / React.js)"
          ]
        },
        {
          "time": "Summer 2018",
          position: "Developer / QA Engineer Intern",
          description: [
            "Expanded automated GUI test frameworks for FENICS UST (US Treasury trading platform) with interactive data visualization for test framework results. (Java, ELK Stack)",
            "Developed a new automated integration test framework for verifying trade data between Front and Middle Office services"
          ]
        },
        {
          "time": "Summer 2017",
          position: "Backend Developer Intern",
          description: [
            "Developed a multi-asset class transaction netting engine. Resulting code was put into production. (Java)"
          ]
        },
      ]
    }
  ];

  return (
    <div className='parent'>
      <div className='canvasContainer'>
        <canvas/>
      </div>
      <div className="main">
        hi, im gavri
      </div>
      <div className="resume">
        <p>resume goes here.</p>
        <p>resume goes here.</p>
        <p>resume goes here.</p>
        <p>resume goes here.</p>
        <p>resume goes here.</p>
      </div>
      <div className="main">
        
      </div>
    </div>
  )
}
