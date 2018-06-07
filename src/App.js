import React, { Component } from "react";
import { Form, Schema, Field, TextEdit, FormEditStates, Chooser } from "react-dynamic-forms";
import Immutable from "immutable";
import { Grid, Row, Col, Button } from "react-bootstrap";
import * as listOfElements from './elementNames.js'

const schema = (
    <Schema>
        <Field name="site_selector" label="Site selector" required={true} />
        <Field name="element_name" label="Element name" required={true} validation={{ type: "string" }} />
        <Field name="element_value" label="Element value" required={false} validation={{ type: "string" }} />
        <Field name="attribute_name" label="Attribute name" required={false} validation={{ type: "string" }} />
        <Field name="attribute_value" label="Attribute value" required={false} validation={{ type: "string" }} />
    </Schema>
);

// Database
const site_selector = Immutable.fromJS({
    "null": {
        name: "All sites",
            },
    "RD": {
        name: "SpringerLink"
           },
    "BMC": {
        name: "BioMed Central"
    }
});

const element_selector = Immutable.fromJS(listOfElements.ELEMENT_NAMES);

class App extends Component {
    constructor() {
        super();
        this.state = {
            hasMissing: false,
            hasErrors: false,
            value: Immutable.Map({
                element_name: "BookInfo",
                site_selector: "RD",
            })
        };
    }



    handleSubmit() {
        this.setState({ submit: true });
    }

    render() {
    const { hasMissing, hasErrors } = this.state;
    const disableSubmit = hasMissing || hasErrors;
    
    const siteSelectorList = site_selector.map(
            (selectedsite, id) =>
                new Immutable.Map({
                    id,
                    label: selectedsite.get("name")
                })
        );

    const elementList = element_selector.map(
            (selectedelement, id) =>
                new Immutable.Map({
                    id,
                    label: selectedelement.get("name")
                })
        );

    return (
        <Grid>
            <Row>
                <Col md={12}>
                    <h1>ML Search Utility</h1>
                </Col>
            </Row>

<div className="App-intro">     
          <h4> Example xml</h4>
            <p>This is a how our xml looks with the names of the <i>things</i> written in their place:</p>
             
          <div className="Xml-example">
            <code>&lt;Element Attribute="Attribute Value"&gt;Element Value&lt;Element&gt; </code>
          </div>
        </div>   
<hr />

            <Row>
                <Col md={12}>

   <h3>Search</h3>
<hr />
<p> The Springer MarkLogic database contains the A++ available on several sites. 
You can either search the entire database (All Sites), 
or choose a particular webiste that the A++ will appear on (such as SpringerLink).</p>
                      <Form
                        name="basic"
                        schema={schema}
                        value={this.state.value}
                        edit={this.state.submit ? FormEditStates.NEVER : FormEditStates.ALWAYS}
                        labelWidth={100}
                        onChange={(fieldName, value) => this.setState({ value })}
                        onMissingCountChange={(fieldName, missing) =>
                            this.setState({ hasMissing: missing > 0 })
                        }
                        onErrorCountChange={(fieldName, errors) =>
                            this.setState({ hasErrors: errors > 0 })
                        }
                    >
                        <Chooser field="site_selector" width={300} disableSearch={false} choiceList={siteSelectorList}/>
                        <hr />


<h3>Search statement(s)</h3>

<hr />

                        <Chooser field="element_name" width={200} choiceList={elementList} />
                        <TextEdit field="element_value" width={200} />
                        <TextEdit field="attribute_name" width={200} />
                        <TextEdit field="attribute_value" width={200} />



<hr />

                        {!this.state.submit ? (
                            <Button
                                className="btn btn-success"
                                style={{ marginLeft: 130, marginTop: 10 }}
                                onClick={() => this.handleSubmit()}
                                disabled={disableSubmit}
                            >
                                Submit
                            </Button>
                        ) : (
                            <div />
                        )}
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col md={12} style={{ marginTop: 50 }}>
                    <h3>Current value</h3>
                    <pre>{JSON.stringify(this.state.value.toJS(), null, 3)}</pre>
                    <p>hasMissing is {JSON.stringify(this.state.hasMissing)}</p>
                    <p>hasErrors is {JSON.stringify(this.state.hasErrors)}</p>
                </Col>
            </Row>
        </Grid>
    );
}
}


export default App;
