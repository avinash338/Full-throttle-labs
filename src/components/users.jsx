import React, { Component } from 'react';
import axios from 'axios';
class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            selectedUser: {},
            time: {
                startTime: '',
                endTime: ''
            }
        }
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers = async () => {
        const url = 'http://localhost:3001/members';
        const response = await axios.get(url);
        this.setState({ userList: response.data });
    }

    handleChange = (e) => {
        const selDate = this.constructDate(e.target.value);
        const tempObj = { ...this.state.selectedUser };
        const selUserActivity = tempObj.activity_periods.filter(item => item.start_time.includes(selDate));
        if (selUserActivity.length) {
            let obj = {
                startTime: selUserActivity[0].start_time.replace(selDate, ''),
                endTime: selUserActivity[0].end_time.replace(selDate, '')
            }
            this.setState({ time: obj });
        } else {
            let obj = {
                startTime: '',
                endTime: ''
            }
            this.setState({ time: obj })
        }
    }

    constructDate = (inputDate) => {
        const date = new Date(inputDate);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const result = months[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
        return result
    }

    selectValue = (user) => {
        this.setState({ selectedUser: user })
    }

    render() {
        const { userList, time } = this.state;
        return (
            <div>
                <div className="user-container">
                    {
                        (userList.length)
                            ? userList.map(user => {
                                return (
                                    <div key={user.id}>
                                        <p className="hover-cls">
                                            <strong> {user.real_name}</strong>
                                            <span>
                                                <button
                                                    className="btn btn-outline-info btn-sm"
                                                    style={{ float: "right" }}
                                                    onClick={() => this.selectValue(user)}
                                                    data-toggle="modal"
                                                    data-target="#myModal">
                                                    Get Activities
                                                </button>
                                            </span>
                                        </p>
                                    </div>
                                )
                            })
                            : null
                    }
                </div>
                <div className="modal" id="myModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="date">Select the date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        className="form-control"
                                        name="selectedDate"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="data-cls">
                                    <strong> <p>START TIME : {time.startTime || 'No Activity Found'}</p></strong>
                                    <strong> <p>END TIME : {time.endTime || 'No Activity Found'}</p> </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Users;