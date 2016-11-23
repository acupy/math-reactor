import React from 'react';
import ReactDOM from 'react-dom';
import {
  ControlLabel, FormControl, Button,
  PageHeader,
  Grid, Row, Col,
} from 'react-bootstrap';

import MathExpressionSolver from 'math-expression-solver';

var LineChart = require("react-chartjs").Line;
var chartData = {
    labels: [],
    datasets: [
        {
            label: "Best result",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        }
    ]
};

class MyComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      chartData: props.data,
      objectiveFunction: 1034, // the result of the formula
      chanceOfMutation: 30,
      tolerance: 0.5,
      populationSize: 200,
      formula: 'x^2+y^2+z^2',
      numberOfIteration: 100, // the formula to solve: looking for x, y, z
      bestX: 0,
      bestY: 0,
      bestZ: 0
    }
  }


  change () {
    // Create an empty chart.
    let chartState = this.state;
    chartState.chartData.datasets[0].data = [];
    chartState.chartData.labels = [];
    this.setState({chartData: chartState});

    // Initialize our Math Expression Solver
    var mes = new MathExpressionSolver( this.state.formula,
                                        this.state.objectiveFunction,
                                        this.state.populationSize,
                                        this.state.chanceOfMutation);

    var theBest, result;
    for (var i = 0; i < this.state.numberOfIteration; i++){
      mes.evolveResult();
      theBest = mes.bestResult();
      result = mes.theGoodness(theBest);

      chartState.bestX = theBest.x;
      chartState.bestY = theBest.y;
      chartState.bestZ = theBest.z;


      // Update the chart
      chartState.chartData.labels.push(i);
      chartState.chartData.datasets[0].data.push(result);
      this.setState(chartState);

      if ( result >= this.state.objectiveFunction - this.state.tolerance &&
           result <= this.state.objectiveFunction + this.state.tolerance ) break;

    }
  }
  handleFieldChange(e){
    this.setState({[e.target.id]: e.target.value});
  }

  render() {

    return <div>
    <PageHeader>Math Expression Solver <small>with genetic algorithm</small></PageHeader>
    <Grid>
      <Row>
        <Col sm={3}>
          <ControlLabel>Formula</ControlLabel>
          <FormControl
            id="formula"
            type="text"
            value={this.state.formula}
            onChange={this.handleFieldChange.bind(this)}
          />
          <ControlLabel>Objective Function</ControlLabel>
          <FormControl
            id="objectiveFunction"
            type="number"
            value={this.state.objectiveFunction}
            onChange={this.handleFieldChange.bind(this)}
          />
          <ControlLabel>Population Size</ControlLabel>
          <FormControl
            id="populationSize"
            type="number"
            value={this.state.populationSize}
            onChange={this.handleFieldChange.bind(this)}
          />
          <ControlLabel>Tolerance</ControlLabel>
          <FormControl
            id="tolerance"
            step={0.5}
            type="number"
            value={this.state.tolerance}
            onChange={this.handleFieldChange.bind(this)}
          />
          <ControlLabel>Chance of mutation (%)</ControlLabel>
          <FormControl
            id="chanceOfMutation"
            type="number"
            value={this.state.chanceOfMutation}
            onChange={this.handleFieldChange.bind(this)}
          />
          <ControlLabel>Number of iteration</ControlLabel>
          <FormControl
            id="numberOfIteration"
            type="number"
            value={this.state.numberOfIteration}
            onChange={this.handleFieldChange.bind(this)}
          />
          <Button onClick={this.change.bind(this)}>Start</Button>
        </Col>
        <Col sm={9}>
          <ControlLabel>x = {this.state.bestX} </ControlLabel>

          <ControlLabel>y = {this.state.bestY} </ControlLabel>

          <ControlLabel>z = {this.state.bestZ}</ControlLabel>

          <LineChart data={this.state.chartData} width="800" height="350"/>
        </Col>
      </Row>
    </Grid>
    </div>
  }
};

ReactDOM.render(
  <MyComponent data={chartData}/>,
  document.getElementById('root')
);
