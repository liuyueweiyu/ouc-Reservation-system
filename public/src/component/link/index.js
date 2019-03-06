import "./index.scss";

export default ({text,_href,click})=>{
    return (
        <a className='link' onClick={click} href={_href}>{text}</a>
    )
}