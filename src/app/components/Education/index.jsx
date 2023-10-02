import CompanyName from "../CompanyName";
import ExpandableDescription from "../ExpandedDescription";
import SkillIcon from "../SkillIcon";

const Education = (props) => {
    return (
    <div className="education">
        <CompanyName name="The Cooper Union for the Advancement of Science and Art" logoSrc="./logos/Cooper.png"></CompanyName>
        <p className="degree">Bachelors in Electrical Engineering, Minor in Computer Science</p>
        <p className="degree">Masters in Electrical Engineering (Expected graduation: May 2023)</p>
        {/* <div className="gap"></div> */}
        <div>
            <ExpandableDescription title="View Relevant Coursework"
                description={
                    <div>
                        <p className="classes">Electronics, Data Structures and Algorithms, Operating Systems, Databases, Signal Processing, Natural
                            Language Processing, Soware Engineering, Communication Networks, Artificial Intelligence, Financial Signal Processing, Deep
                            Learning, Remote Sensing, Computer Graphics
                        </p>
                    </div>
                }
            ></ExpandableDescription>
        </div>
        <div className="gap"></div>
        <p>Technical Skills:</p>
        <div className="skillGrid">
            <SkillIcon img="./logos/cpp.png" tooltipText="C++"></SkillIcon>
            <SkillIcon img="./logos/python.png" tooltipText="Python"></SkillIcon>
            <SkillIcon img="./logos/java.png" tooltipText="Java"></SkillIcon>
            <SkillIcon img="./logos/js.png" tooltipText="Javascript"></SkillIcon>
            <SkillIcon img="./logos/go.png" tooltipText="Golang"></SkillIcon>
            <SkillIcon img="./logos/odin.png" tooltipText="Odin"></SkillIcon>
            <SkillIcon img="./logos/opengl.png" tooltipText="OpenGL"></SkillIcon>
            <SkillIcon img="./logos/aws.png" tooltipText="Amazon Web Services"></SkillIcon>
            <SkillIcon img="./logos/ddb.png" tooltipText="DynamoDB"></SkillIcon>
            <SkillIcon img="./logos/mysql.png" tooltipText="MySQL"></SkillIcon>
            <SkillIcon img="./logos/mongo.png" tooltipText="MongoDB"></SkillIcon>
            <SkillIcon img="./logos/unity.png" tooltipText="Unity3D Engine"></SkillIcon>
            <SkillIcon img="./logos/blender.png" tooltipText="Blender"></SkillIcon>

        </div>
    </div>);
}

export default Education;