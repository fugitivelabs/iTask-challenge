/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// import actions
import * as taskActions from "../taskActions";

// import global components
import Binder from "../../../global/components/Binder.js.jsx";

// import resource components
import TaskLayout from "../components/TaskLayout.js.jsx";
import CommentsView from "../../comments/views/CommentsView.jsx";

class SingleTask extends Binder {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
  }

  render() {
    const { taskStore } = this.props;

    /**
     * use the selected.getItem() utility to pull the actual task object from the map
     */
    const selectedTask = taskStore.selected.getItem();

    const isEmpty =
      !selectedTask || !selectedTask._id || taskStore.selected.didInvalidate;

    const isFetching = taskStore.selected.isFetching;
    return (
      <TaskLayout>
        <h3> Single Task </h3>
        {isEmpty ? (
          isFetching ? (
            <h2>Loading...</h2>
          ) : (
            <h2>Empty.</h2>
          )
        ) : (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <h1> {selectedTask.name}</h1>
            <hr />
            <p>{selectedTask.description}</p>
            <br />
            <Link to={`${this.props.match.url}/update`}> Update Task </Link>
            <CommentsView taskId={this.props.match.params.taskId} />
          </div>
        )}
      </TaskLayout>
    );
  }
}

SingleTask.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
  /**
   * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
   * differentiated from the React component's internal state
   */
  return {
    taskStore: store.task,
  };
};

export default withRouter(connect(mapStoreToProps)(SingleTask));
