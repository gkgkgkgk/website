'use client';

import Text from './components/Text'
import Button from './components/Button'
import CircleImage from './components/CircleImage'
import ResumeItem from './components/ResumeItem';
import Education from './components/Education';
import SkillIcon from './components/SkillIcon';
import TopCanvas from './components/TopCanvas';
import ThreeDCanvas from './components/ThreeDCanvas';

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
            "Created a feature to collect a new type of data point for the Connections team to gather feedback from high profile employees at the company. The new feature was integrated into Amazon Connections, an application used internally at Amazon to collect feedback from employees, and pushed into production. (Java, React, AWS)"
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
            "Developed a new launchpad for FENICS, an electronic US treasuries trading platform. The new launchpad integrates real time market data, news, and streamlines the user experience when launching the trading applications. (Node.js / React.js)"
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
    <div>
    <div className='bg'>
    <div className="home">
      <TopCanvas></TopCanvas>
      <div className='topContainer'>
        <Text size="small" text="Hi, my name is" className="hi"></Text>
        <Text size="big" text="GAVRI KEPETS" className="name"></Text>
        <CircleImage img="gavri.jpg" className='photo'></CircleImage>
        <Text className="desc" size="small" text="I am currently a Master's student in Electrical and Computer Engineering at The Cooper Union. I love computer graphics, simulations, game development, and all things engineering."></Text>
        <div className="resumeButtonDiv" style={{paddingTop: '10vh'}}>
            <Button class="resumeButton" text="▼ View my Resume ▼" onClick={scrollToElement}></Button>
            <a href={"resume_gkepets.pdf"} download={"resume_gkepets.pdf"} >
              <button className='dlResumeButton'>📜 Download Resume PDF 📜</button>
            </a>
        </div>
      </div>
      
      <div className='resume' id='resume'>
        <Text size="medium" text="Education and Skills"></Text>
        <hr style={{width: "100%", margin: "20px"}}></hr>
        <div>
          <Education></Education>
        </div>
        <div className='gap'></div>
        <Text size="medium" text="Experience"></Text>
        <hr style={{width: "100%", margin: "20px"}}></hr>
        <div>
          <ResumeItem jobs={jobs}></ResumeItem>
        </div>
        <div className='gap'></div>
        <Text size="medium" text="Projects and Links"></Text>
        <hr style={{width: "100%", margin: "20px"}}></hr>
        <p>Blog for Personal Projects: (<a href="https://gkgkgkgk.github.io/">gkgkgkgk.github.io/</a>)</p>
        <p>PB*: Preference-Based Path-Planning for Autonomous Robots: (<a href="https://pathplanning.online/">https://pathplanning.online</a>)</p>
        <p><a href="/ApolloSim.pdf" target="_blank">ApolloSim: A Lidar Sensor with Calibrated Noise</a></p>
        <div className='smallGap'></div>
        <div className='links' style={{display: 'flex', justifyContent: "space-around"}}>
          <a href="https://www.github.com/gkgkgkgk"><SkillIcon img="logos/github.png"></SkillIcon></a>
          <a href="https://www.linkedin.com/in/gabriel-kepets-624076143/"><SkillIcon img="logos/linkedin.png"></SkillIcon></a>
        </div>
        <div className='smallGap'></div>
        <a href={"resume_gkepets.pdf"} download={"resume_gkepets.pdf"}>
          <button className='resumeButton'>📜 Download Resume PDF 📜</button>
        </a>
      </div>
    </div>
    </div>
    <div className='bottomDiv'>
        <p className='renderedWith'>Rendered with GLSL</p>
        <ThreeDCanvas></ThreeDCanvas>
      </div>
    </div>
  )
}