import "./styles.css"

const Button = (props) => {
    return (
      <div>
        <button className={props.class} onClick={props.onClick}>
          {props.text}
        </button>
      </div>
    );
}

export default Button;