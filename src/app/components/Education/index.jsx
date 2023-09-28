import CompanyName from "../CompanyName";
import ExpandableDescription from "../ExpandedDescription";
import SkillIcon from "../SkillIcon";

const Education = (props) => {
    return (
    <div>
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
            <SkillIcon img="./logos/cpp.png"></SkillIcon>
            <SkillIcon img="./logos/python.png"></SkillIcon>
            <SkillIcon img="./logos/java.png"></SkillIcon>
            <SkillIcon img="./logos/js.png"></SkillIcon>
            <SkillIcon img="./logos/go.png"></SkillIcon>
            <SkillIcon img="./logos/odin.png"></SkillIcon>
            <SkillIcon img="./logos/opengl.png"></SkillIcon>
            <SkillIcon img="./logos/aws.png"></SkillIcon>
            <SkillIcon img="./logos/ddb.png"></SkillIcon>
            <SkillIcon img="./logos/mysql.png"></SkillIcon>
            <SkillIcon img="./logos/mongo.png"></SkillIcon>
            <SkillIcon img="./logos/unity.png"></SkillIcon>
            <SkillIcon img="./logos/blender.png"></SkillIcon>

        </div>
    </div>);
}

export default Education;