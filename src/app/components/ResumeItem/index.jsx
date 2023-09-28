import CompanyName from "../CompanyName";
import ExpandableDescription from "../ExpandedDescription";

const Experience = ({experience}) => {
    return (
        <div className="experience">
            <div>
                <p>{experience.time}</p>
                <p>{experience.position}</p>
            </div>
            <ExpandableDescription title="View Details" description={
                <div className="descriptionList">
                    {experience.description.length > 1 ?
                    <ul className="description">
                        {experience.description.map((d, i) => {
                            return <li key={i}>{d}</li>
                        })}
                    </ul> : <p>{experience.description[0]}</p>}
                </div>
            }></ExpandableDescription>
            
        </div>
    );
} 

const ResumeItem = (props) => {
    return (<div>
        {props.jobs.map((job, i) => {
            return (<div className="resumeItem" key={i}>
                <CompanyName name={job.company} logoSrc={job.logo}></CompanyName>
                <p className="location">{job.location}</p>
                {job.experiences.map((item, i) => {
                    return <Experience experience={item} key={i}></Experience>
                })}
            </div>)
        })}
    </div>);
}

export default ResumeItem;