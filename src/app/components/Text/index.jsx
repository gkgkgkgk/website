import "./styles.css"

const Text = (props) => {
    return (
      <h2 className={props.size + "Font"}>
        {props.text}
      </h2>
    );
}

export default Text;