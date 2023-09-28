import "./styles.css"

const SkillIcon = (props) => {
    return (
      <div style={{ aspectRatio: '1/1', width: "50px", display: "flex", padding: "5px"}}>
        <img src={props.img} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
      </div>
    );
}

export default SkillIcon;