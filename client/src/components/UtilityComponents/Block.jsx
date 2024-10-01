import React from 'react';
import "./Block.css";

const Block = (props) => {
    return (
        <div className={`block ${props.customClass}`} id={props.id}>
            {props.children}
        </div>
    )
}

export default Block