import React, { Component } from "react";

import { Form, Row, Col, Button, Image, Modal } from "react-bootstrap";
import Switch from "react-switch";
import { connect } from "react-redux";
import { HTTP } from "../../../common/http-common";
import { notify } from "react-notify-toast";
import NewImage from "../NewImage";
import "./RouteNew.css";

class RouteNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: {
        // Modified every time a new image is added
        name: "",
        description: "",
        path: 0,
        position: {
          type: "Point",
          coordinates: [20, 0]
        }
      },
      imagesShow: [], // Images to show on RouteNew
      imagesUpload: [], // Image files to upload to resources
      imagesUploadObject: [], // Image objects with name, description and coordinates
      modalShow: false,
      route: {
        isPublic: false
      }
    };

    this.fileInput = React.createRef();
    this.handleSubmitNew = this.handleSubmitNew.bind(this);
    this.handleIsPublicChange = this.handleIsPublicChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  componentDidMount() {
    this.getPilot();
  }

  goBack() {
    this.props.history.goBack();
  }

  getPilot = async () => {
    let res = await HTTP.get(`users/${this.props.login}`);

    let pilot = res.data;

    this.setState({
      route: {
        ...this.state.route,
        pilot: pilot
      }
    });
  };

  /// UPLOADING ///

  handleSubmitNew(event) {
    event.preventDefault();
    if (this.fileInput.current.files.length === 0) {
      notify.show("Please add a GPX file.", "error", 3000);
    } else {
      if (this.fileInput.current.files[0].name.endsWith(".gpx") === false) {
        notify.show("File must be in a GPX format.", "error", 3000);
      } else {
        this.setState({
          pathFile: this.fileInput.current.files[0]
        });
        this.uploadRoute();
      }
    }
  }

  //Route
  uploadRoute = async () => {
    const route = this.state.route;

    await HTTP.post(`/routes`, route)
      .then(response => this.setState({ imRoute: response.data }))
      .catch(function(error) {
        notify.show("Error uploading route.", "error", 3000);
      });

    this.uploadGPX();
    this.uploadImageObjects();
  };

  //ImagesUploadObject
  uploadImageObjects = () => {
    const route = this.state.imRoute;
    const imageObjects = this.state.imagesUploadObject;

    let thisID;

    const {
      history: { push }
    } = this.props;

    imageObjects.forEach(async function(image, index) {
      await HTTP.post(`images/${route.id}`, image)
        .then(function(response) {
          thisID = response.data.id;
        })
        .catch(function(error) {
          notify.show("Error uploading image object.", "error", 3000);
        });

      this.uploadImage(thisID, index);
    }, this);

    notify.show("Route successfully created", "success", 3000);
    push("/routes");
  };

  //ImagesUpload (Image files)
  uploadImage = async (id, index) => {
    const routeId = this.state.imRoute.id;
    var formData = new FormData(); // FormData images
    formData.append(
      "file",
      this.state.imagesUpload[index],
      "routeImage" + id + ".jpg"
    );

    await HTTP.put(`routes/uploadfiles/${routeId}`, formData, {
      "Content-Type": "multipart/form-data"
    })
      .then(function(response) {})
      .catch(function(error) {
        notify.show("Error uploading image file", "error", 3000);
      });
  };

  //Upload GPX file
  uploadGPX = async () => {
    const file = this.state.pathFile;
    const id = this.state.imRoute.id;
    var formData = new FormData(); // FormData images

    formData.append("file", file, "route" + id + "pathFile.gpx");

    await HTTP.put(`routes/uploadfiles/${id}`, formData, {
      "Content-Type": "multipart/form-data"
    })
      .then(function(response) {})
      .catch(function(error) {
        notify.show("Error uploading image file", "error", 3000);
      });
  };

  // GET AERODROMES //
  getTakeoffAerodrome = async event => {
    event.preventDefault();
    let res = await HTTP.get(`aerodromes/${event.target.value}`);
    let toAer = res.data;
    this.setState({
      route: { ...this.state.route, takeoffAerodrome: toAer }
    });
  };

  getLandingAerodrome = async event => {
    event.preventDefault();
    let res = await HTTP.get(`aerodromes/${event.target.value}`);
    let toAer = res.data;
    this.setState({
      route: { ...this.state.route, landingAerodrome: toAer }
    });
  };

  // IMAGES //
  showImages() {
    let imagesShow = [];

    for (let index = 0; index < 6; index++) {
      let source;
      this.state.imagesShow[index]
        ? (source = this.state.imagesShow[index])
        : (source = "/images/defaultPic.jpg");

      imagesShow.push(
        <Col key={index}>
          <Image
            onClick={this.addImageOpenModal}
            className="routeImage"
            src={source}
            alt="avatar"
            rounded
          />
        </Col>
      );
    }

    return imagesShow;
  }

  imageDeleted = () => {
    let imageShowArray = this.state.imagesShow;
    imageShowArray.pop();
    let imageUploadArray = this.state.imagesUpload;
    imageUploadArray.pop();
    this.setState({ newImage: false });
  };

  handleImgFile = picture => {
    let imageShowArray = this.state.imagesShow;
    imageShowArray.push(URL.createObjectURL(picture[0]));
    let imageUploadArray = this.state.imagesUpload;
    imageUploadArray.push(picture[0]);

    this.setState({
      imagesShow: imageShowArray,
      imagesUpload: imageUploadArray,
      imgModal: URL.createObjectURL(picture[0]),
      // image: {
      //   ...this.state.image,
      //   file: URL.createObjectURL(picture[0])
      // },
      newImage: true
    });
  };

  handleImageChange = event => {
    event.preventDefault();
    if (event.target.name === "x") {
      this.setState({
        image: {
          ...this.props.image,
          position: {
            ...this.props.image.position,
            coordinates: [
              event.target.value,
              this.props.image.position.coordinates[1]
            ]
          }
        },
        selectedCoord: true
      });
    } else if (event.target.name === "y") {
      this.setState({
        image: {
          ...this.props.image,
          position: {
            ...this.props.image.position,
            coordinates: [
              this.props.image.position.coordinates[0],
              event.target.value
            ]
          }
        },
        selectedCoord: true
      });
    } else {
      this.setState({
        image: {
          ...this.state.image,
          [event.target.name]: event.target.value
        }
      });
    }
  };

  handleMapClick(e) {
    let x = e.latlng.lat;
    let y = e.latlng.lng;
    let newPos = [x, y];
    this.setState(prevState => ({
      image: {
        ...this.state.image,
        position: {
          ...this.state.image.position,
          coordinates: newPos
        }
      }
    }));
  }

  // MODAL //
  uploadImageModal() {
    return (
      <Modal
        show={this.state.modalShow}
        onHide={this.handleCloseModal}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton className="newImageModal">
          <Modal.Title
            className="modalTitle"
            id="contained-modal-title-vcenter"
          >
            Add a new image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="newImageModal">
          <NewImage
            image={this.state.image}
            imgModal={this.state.imgModal}
            handleImgFile={this.handleImgFile}
            handleImageChange={this.handleImageChange}
            handleClick={this.handleMapClick}
            imageDeleted={this.imageDeleted}
          ></NewImage>
        </Modal.Body>
        <Modal.Footer className="newImageModal">
          <Button variant="new" onClick={this.handleCloseModal}>
            Cancel
          </Button>
          <Button variant="new" onClick={this.handleSaveImage}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleCloseModal = () => {
    let imageShowArray = this.state.imagesShow;
    let imageUploadArray = this.state.imagesUpload;

    if (this.state.newImage === true) {
      imageShowArray.pop();
      imageUploadArray.pop();
      this.setState({
        imagesShow: imageShowArray,
        imagesUpload: imageUploadArray,
        modalShow: false
      });
    } else this.setState({ modalShow: false });
  };

  handleSaveImage = () => {
    let imageObjArray = this.state.imagesUploadObject;
    imageObjArray.push(this.state.image);
    if (this.state.image.path === 0) {
      this.setState({
        modalShow: false,
        imagesUploadObject: imageObjArray,
        newImage: false
      });
    } else {
      this.setState({
        modalShow: false,
        imagesUploadObject: imageObjArray,
        newImage: false,
        image: {
          ...this.state.image,
          path: this.state.path + 1
        }
      });
    }
  };

  showState = () => {
    console.log("Files >>> ", this.state.imagesUpload);
    console.log("Objects >>> ", this.state.imagesUploadObject);
    console.log("Show >>> ", this.state.imagesShow);
    console.log("Route >>> ", this.state.route);
    console.log("IMROUTE >>> ", this.state.imRoute);
  };

  addImageOpenModal = () => {
    if (this.state.imagesUpload.length === 6) {
      notify.show("You can't upload more than 6 images.", "error", 3000);
    } else this.setState({ modalShow: true });
  };

  // FORM DATA //

  handleIsPublicChange(checked) {
    this.setState({
      route: {
        ...this.state.route,
        isPublic: checked
      }
    });
  }

  handleInputChange = event => {
    this.setState({
      route: {
        ...this.state.route,
        [event.target.name]: event.target.value
      }
    });
  };

  // RENDER //
  renderRouteForm() {
    return (
      <Form onSubmit={this.handleSubmitNew}>
        <Row>
          <Col>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                placeholder="Name"
                type="text"
                name="name"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group as={Col} controlId="formGridGpxFile">
              <Form.Label>GPX file</Form.Label>
              <Form.Control
                required
                className="gpxInput"
                type="file"
                name="gpxFile"
                ref={this.fileInput}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group as={Col} controlId="formGridDepAirport">
              <Form.Label>Departure airport</Form.Label>
              <Form.Control
                required
                defaultValue={1}
                as="select"
                name="takeoffAerodrome"
                onChange={this.getTakeoffAerodrome}
              >
                <option value={1} default disabled>
                  Select an airport...
                </option>
                {this.props.aerodromes.map(function(aerodrome, index) {
                  return <option key={index}>{aerodrome.name}</option>;
                }, this)}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group as={Col} controlId="formGridArrAirport">
              <Form.Label>Arrival airport</Form.Label>
              <Form.Control
                required
                as="select"
                defaultValue={1}
                name="landingAerodrome"
                onChange={this.getLandingAerodrome}
              >
                <option value={1} default disabled>
                  Select an airport...
                </option>
                {this.props.aerodromes.map(function(aerodrome, index) {
                  return <option key={index}>{aerodrome.name}</option>;
                }, this)}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group as={Col} controlId="formGridImages">
              <Form.Label>Upload images associated with your route</Form.Label>{" "}
            </Form.Group>
          </Col>
        </Row>
        <Row>{this.showImages()}</Row>
        <Row>
          <Col>
            <Button
              className="btn m-3"
              variant="new"
              onClick={this.addImageOpenModal}
            >
              Add Image
            </Button>
            <Button className="btn m-3" variant="new" onClick={this.showState}>
              Show state
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group as={Col} controlId="formGridDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                placeholder="Describe the route..."
                as="textarea"
                name="description"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group as={Col}>
              <Form.Label>Make this route public</Form.Label>{" "}
              <Switch
                className="publicSwitch"
                onChange={this.handleIsPublicChange}
                checked={this.state.route.isPublic}
                offColor="#cc4b4b"
                onColor="#3cbd43"
                uncheckedIcon={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      fontSize: 15,
                      fontWeight: 400,
                      color: "white",
                      paddingRight: 2
                    }}
                  >
                    No
                  </div>
                }
                checkedIcon={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      fontSize: 15,
                      fontWeight: 400,
                      color: "white",
                      paddingLeft: 1
                    }}
                  >
                    Yes
                  </div>
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Button className="btn m-3" variant="new" type="submit">
          Save
        </Button>
      </Form>
    );
  }

  render() {
    return (
      <div className="container">
        {this.uploadImageModal()}
        <h2 className="tittle">
          Create new route
          <Button variant="back" onClick={this.goBack}>
            Back
          </Button>
        </h2>
        <hr />
        {this.renderRouteForm()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    aerodromes: state.aerod.aerodromes,
    login: state.auth.login
  };
}

export default connect(mapStateToProps)(RouteNew);
