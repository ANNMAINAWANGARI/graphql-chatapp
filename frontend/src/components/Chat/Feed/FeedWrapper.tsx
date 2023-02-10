import { Session } from 'next-auth';
import React from 'react';

type FeedWrapperProps = {
    session:Session
};

const FeedWrapper:React.FC<FeedWrapperProps> = ({session}) => {
    
    return <div style={{border:'1px solid white',width:"100%",backgroundColor:'green'}}>Have a good coding Feed</div>
}
export default FeedWrapper;