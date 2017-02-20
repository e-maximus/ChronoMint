import React, {Component} from 'react';
import globalStyles from '../../../styles';
import {connect} from 'react-redux';


const mapStateToProps = (state) => ({
    user: state.get('sessionData')
});

@connect(mapStateToProps, null)
class Breadcrumbs extends Component {
    render() {
        return(
            <h3 style={globalStyles.navigation}>
                ChronoMint / { this.props.user.profile.loc ? 'CBE Dashboard' : 'LOC Dashboard'}
            </h3>
        );
    }
}

export default Breadcrumbs;