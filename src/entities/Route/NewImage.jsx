import React, { Component } from "react";
import { Form, Row, Col, Image } from "react-bootstrap";
import ImageUploader from "react-images-upload";
import MapImage from "../Route/MapImage";
import DeleteIcon from "../../icons/Delete";

class NewImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: 0,
      selectedCoord: false,
      zoom: 1
    };
  }

  onDrop = picture => {
    this.props.handleImgFile(picture);
    this.setState({
      loading: 1
    });
  };

  deleteImage = () => {
    this.props.imageDeleted();
    this.setState({
      loading: 0
    });
  };

  renderImage() {
    if (this.props.image && this.state.loading === 1) {
      return (
        <Row className="imageRow">
          <Image
            className="newImage"
            src={this.props.imgModal}
            alt="Image"
            rounded
          />
          <div className="overlay">
            <DeleteIcon
              className="deleteImageRoute"
              onClick={() => this.deleteImage()}
              width="25px"
              height="25px"
            ></DeleteIcon>
          </div>
        </Row>
      );
    } else
      return (
        <ImageUploader
          withIcon={true}
          buttonText="Upload image"
          onChange={this.onDrop}
          imgExtension={[".jpg", ".jpeg"]}
          maxFileSize={15242880}
          singleImage={true}
          withLabel={true}
          label="Max file size: 5mb Accepted: jpg"
          withPreview={false}
          fileTypeError="File extension not supported"
        />
      );
  }

  render() {
    let iPosition = this.props.image.position.coordinates;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col>
            <Row>
              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  placeholder="Name"
                  type="text"
                  name="name"
                  onChange={this.props.handleImageChange}
                />
              </Form.Group>
            </Row>
            <Row>
              <Col>{this.renderImage()}</Col>
            </Row>
          </Col>
          <Col>
            <MapImage
              initialPosition={iPosition}
              zoom={this.state.zoom}
              handleClick={this.props.handleClick}
              selectedCoord={this.state.selectedCoord}
            ></MapImage>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <Form.Group as={Col} controlId="formGridDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  placeholder="Describe the image..."
                  as="textarea"
                  name="description"
                  onChange={this.props.handleImageChange}
                />
              </Form.Group>
            </Row>
          </Col>
          <Col>
            <Row>
              <Form.Group className="m-3" as={Col} controlId="formGridX">
                <Form.Label>Latitude:</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Latitude"
                  value={this.props.image.position.coordinates[0]}
                  name="x"
                  onChange={this.props.handleImageChange}
                />
              </Form.Group>

              <Form.Group className="m-3" as={Col} controlId="formGridY">
                <Form.Label>Longitude:</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Longitude"
                  value={this.props.image.position.coordinates[1]}
                  name="y"
                  onChange={this.props.handleImageChange}
                />
              </Form.Group>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default NewImage;
