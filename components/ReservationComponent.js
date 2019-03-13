import React, { Component } from 'react';
import { Text, View, ScrollView, Picker, Button, StyleSheet, Switch, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';

class Reservation extends Component {

    constructor(props) {
	super(props)
	this.state = {
	    guests: 1,
	    smoking: false,
	    date:'',
	    showModal: false
	}
    }

    static navigationOptions =  {
	title: 'Reserve Table'
    }

    handleReservation() {
	Alert.alert(
	    'Your Reservation OK?',
	    'Number of Guests: '+this.state.guests+'\nSmoking? '+this.state.smoking+'\nDate and Time: '+this.state.date,
	    [
		{
		    text: 'Cancel',
		    onPress: () => this.resetForm(),
		    style: 'cancel'
		},
		{
		    text: 'OK',
		    onPress: () => this.resetForm()
		}
	    ]
	);
    }

    resetForm() {
	this.setState({
	    guests: 1,
	    smoking: false,
	    date:''
	})
    }

    render() {

	const values = ['2','3','4','5','6'];
	const pickerValues = values.map((v) => {
	return (
	<Picker.Item key={v} label={v} value={v} />
	)
  	});


    pickerValues.unshift(<Picker.Item key='1' label='1' value='1'/>)

	return (
	    <Animatable.View animation="zoomIn" duration={2000}>
		<View style={styles.formRow}>
		    <Text style={styles.formLabel}>Number of Guests</Text>
		    <Picker
			style={styles.formItem}
			selectedValue={this.state.guests}
			onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
			{pickerValues}
		    </Picker>
		</View>
		<View style={styles.formRow}>
		    <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
		    <Switch style={styles.formItem}
			value={this.state.smoking}
			trackColor='#512DA8'
			onValueChange={(value) => this.setState({smoking: value})}>
		    </Switch>
		</View>
		<View style={styles.formRow}>
		    <Text style={styles.formLabel}>Date and Time</Text>
		    <DatePicker
			style={{flex:2,marginRight:20}}
			date={this.state.date}
			format=''
			mode='datetime'
			placeholder='select date and time'
			minDate='2017-01-01'
			confirmBtnText='Confirm'
			cancelBtnText='Cancel'
			customStyles={{
			    dateIcon: {
				position: 'absolute',
				left: 0,
				top: 4,
				marginLeft: 0
			    },
			    dateInput: {
				marginLeft: 36
			    }
			}}
			    onDateChange={(date) => {this.setState({ date: date})}}
			/>
		</View>
		<View style={styles.formRow}>
		    <Button
			title='Reserve'
			color='#512DA8'
			onPress={() => this.handleReservation()}
			accessibilityLabel='Learn more about this purple button' />
		</View>
	    </Animatable.View>
	);
    }

}

const styles = StyleSheet.create({
    formRow: {
	alignItems: 'center',
	justifyContent: 'center',
	flex: 1,
	flexDirection: 'row',
	margin: 20
    },
    formLabel: {
	fontSize: 18,
	flex: 2
    },
    formItem: {
	flex: 1
    }
})

export default Reservation;
