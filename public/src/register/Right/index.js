import './index.scss';

export default ()=>{
    return (
        <div className='right'>
            <div className='detail'>
                <h3>众创空间简介</h3>
                <p>    歌尔众创空间是中国海洋大学信息科学与工程学院联合歌尔股份有限公司共同创建的创新创教育的产物，是学院校企合作的重要成果。同时是学生碰撞思想、激发创意的空间，科技创新、训练思维的平台，创新创业、项目孵化的基地。</p>
                <img src={require('./logo.png') }/>
            </div>
        </div>
    )
}