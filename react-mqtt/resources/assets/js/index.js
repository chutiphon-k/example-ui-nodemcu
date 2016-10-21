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
const  defaultIpBroker = '192.168.10.10', defaultPortWSBroker = 9001

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
		datas : [],
		statusConnectionBroker : 'Wait...'
	}

	configConnectBroker(ip, port){
		if( typeof client !== "undefined" ){
			client.end()
		}

		client  = mqtt.connect(`ws://${ip}:${port}`,{
		  cmd: 'connect',
		  clientId: 'Web',
		})

		client.on('connect',  () => {
			client.subscribe('#')
		  	this.setState({ datas : []})
		})

		client.on('message', (topic, message, packet) => {
			console.log(packet)
			let data = {
				topic : topic,
				message : message.toString(),
				client_name : client.options.clientId
			}
			this.setState({ datas : [...this.state.datas, data] })
		})	
	}

	componentWillMount(){
		this.configConnectBroker(defaultIpBroker, defaultPortWSBroker)
	}



	bbb(){
		let { topic, message } = this.refs.formSendMessage

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
		      	<h1>Mqtt Message</h1>
		      	<hr/>
		      	<h3>Config Connection to Mqtt Broker</h3>
		      	<form action="javascript:void(0)" onSubmit={(event) => this.configConnectBroker(event.target.ip.value, event.target.port.value)} ref = 'formConfigClient'>
			      	IP : <input type="text" name='ip' defaultValue="localhost" placeholder="IP : localhost"/><br/>
			      	Port : <input type="text" name='port' defaultValue="9001" placeholder='Port : 9001'/><br/>
					<Button bsStyle="success" type='submit'>Send</Button>
		      	</form>
		      	<hr/>
		      	<h3>Send Message</h3>
		      	<form action="javascript:void(0)" onSubmit={() => this.bbb()} ref = 'formSendMessage'>
			      	Topic : <input type="text" name='topic' placeholder='Example : /ESP/LED'/><br/>
			      	Message : <input type="text" name='message' placeholder='Example : HelloWorld'/><br/>
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