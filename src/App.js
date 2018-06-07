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
            element_value: "",
            attribute_name: "",
            attribute_value: ""
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
                    <h1>Search Statement</h1>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
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



                        <Chooser field="element_name" width={200} choiceList={elementList} />
                        <TextEdit field="element_value" width={200} />
                        <TextEdit field="attribute_name" width={200} />
                        <TextEdit field="attribute_value" width={200} />
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
