import React, { Component } from 'react'
import { render } from 'react-dom'
import mqtt from 'mqtt'
import { 
	Grid,
	Row,
	Col,
	Clearfix,
	Table,
	Button
} from 'react-bootstrap';

let client


const RowData = ({index, topic, message, client_name}) => {
	return (
		    <tr>
		    	<td>{index}</td>
		        <td>{topic}</td>
		        <td>{message}</td>
		        <td>{client_name}</td>
		    </tr>
	)

}


export default class HelloWorld extends Component{

	state = {
		x : 'empty',
		datas : []

	}

	componentWillMount(){
		client  = mqtt.connect('ws://localhost:9001',{
		  cmd: 'connect',
		  clientId: 'Web',
		})

		client.on('connect', function () {
		  client.subscribe('#')
		})
		 
		client.on('message', (topic, message, packet) => {
			console.log(message.toString())
			let data = {
				topic : topic,
				message : message.toString(),
				client_name : client.options.clientId
			}
			this.setState({ datas : [...this.state.datas, data] })
		})
	}

	bbb(){
		console.log('aaaa')
		let { topic, message } = this.refs.form

		if(topic.value != '' && message.value != ''){
			client.publish(topic.value, message.value)
		}
	}

	render(){
		return (
		  <Grid>
		    <Row className="show-grid">
		      <Col md={1}>
				<br/>
		      </Col>
		      <Col md={10}>
		      	<h1>Watching Mqtt Message</h1>
		      	<form action="javascript:void(0)" onSubmit={() => this.bbb()} ref = 'form'>
			      	Topic : <input type="text" name='topic'/><br/>
			      	Message : <input type="text" name='message'/><br/>
					<Button bsStyle="success" type='submit'>Send</Button>
		      	</form>
				<br/>
				<br/>
				<Table responsive striped bordered condensed hover>
				    <thead>
				      <tr>
				        <th>#</th>
				        <th>Topic</th>
				        <th>Message</th>
				        <th>Client Name</th>
				      </tr>
				    </thead>
				    <tbody>
				    	{
				    		this.state.datas.map( (data, index) => {
				    			return (
									<RowData 
										key={index}
										index={index+1} 
										topic={data.topic} 
										message={data.message} 
										client_name={data.client_name}
									/>
				    			)
				    		})
				    	}
				    </tbody>
				  </Table>
		      </Col>
		      <Col md={1}>
				<br/>
		      </Col>
		    </Row>
		  </Grid>
		)
	}
}

render( <HelloWorld/>, document.getElementById('app'))