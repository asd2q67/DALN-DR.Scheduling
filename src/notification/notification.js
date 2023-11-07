import React from "react";



const DropDownNotification = ({data}) => {

    return (
        
        <div className="notification" tabIndex="1">

            <h2 className="notification-header">Thông báo</h2>

            <div className="select" role="button" tabIndex="1">
                <a href="#" className="hyperlink">
                    <span className="all">
                        Tất cả
                    </span>
                </a>
                <a href="#" className="hyperlink">
                    <span className="unread">
                        Chưa đọc
                    </span>
                </a>
            </div>
            <div className="notification-item">
                {data.map((item) => (
                    <div key={item.title}>
                        <h3>{item.title}</h3>
                        <p>{item.message}</p>
          </div>
        ))} 
            </div>
        </div>   
    )}


export default DropDownNotification