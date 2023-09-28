import "./styles.css"

const CircleImage = (props) => {
    return (
      <div style={{width: '15%', minWidth:'200px', maxWidth: '500px', padding: '20px', display: "flex", alignContent: 'center'}}>
        <div style={{ aspectRatio: '1/1', borderRadius: '50%', overflow: 'hidden'}}>
          <img src={props.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    );
}

export default CircleImage;