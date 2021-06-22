import React, { Component } from 'react';

class Loading extends Component {
    render(){
        return(
            <>
                <div className="fd" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{margin: 'auto', background: 'rgba(241, 242, 243,0)', display: 'block'}} width="191px" height="191px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <circle cx="50" cy="50" r="3.04639" fill="none" stroke="#eb7f19" strokeWidth="2">
                            <animate attributeName="r" repeatCount="indefinite" dur="1.8518518518518516s" values="0;20" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="-0.9259259259259258s"></animate>
                            <animate attributeName="opacity" repeatCount="indefinite" dur="1.8518518518518516s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="-0.9259259259259258s"></animate>
                        </circle>
                        <circle cx="50" cy="50" r="14.1886" fill="none" stroke="#dfa950" strokeWidth="2">
                            <animate attributeName="r" repeatCount="indefinite" dur="1.8518518518518516s" values="0;20" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline"></animate>
                            <animate attributeName="opacity" repeatCount="indefinite" dur="1.8518518518518516s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline"></animate>
                        </circle>

                    </svg>
                </div>
            </>
        )
    }
}

export default Loading;