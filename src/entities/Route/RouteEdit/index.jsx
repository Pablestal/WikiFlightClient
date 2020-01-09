import React, { Component } from "react";
import { Form, Row, Col, Button, Image, Modal } from "react-bootstrap";
import Switch from "react-switch";
import { connect } from "react-redux";
import { HTTP } from "../../../common/http-common";
import { notify } from "react-notify-toast";
import NewImage from "../NewImage";
import Loader from "react-loader-spinner";

class RouteEdit extends Component {
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
      imagesShow: [], // Images to show on RouteEdit
      imagesUpload: [], // Image files to upload to resources
      imagesUploadObject: [], // Image objects with name, description and coordinates
      modalShow: false
    };

    this.fileInput = React.createRef();
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    this.handleIsPublicChange = this.handleIsPublicChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  componentDidMount() {
    HTTP.get(`routes/detail/${this.props.match.params.id}`)
      .then(res => {
        const route = res.data;
        let imgShowArray = res.data.images.map(
          a =>
            "http://localhost:8080/api/users/image/route" +
            res.data.id +
            "Image" +
            a.id +
            ".jpg"
        );
        this.setState({ route, imagesShow: imgShowArray });
      })
      .catch(error => {
        notify.show("Error loading route.", "error", 3000);
        this.goBack();
      });
  }

  /////// UPLOAD ///////

  handleSubmitEdit(event) {
    event.preventDefault();
    if (this.fileInput.current.files.length > 0) {
      if (this.fileInput.current.files[0].name.endsWith(".gpx") === false) {
        notify.show("File must be in a GPX format.", "error", 3000);
      } else {
        this.setState({
          pathFile: this.fileInput.current.files[0]
        });
        this.editRoute();
      }
    } else this.editRoute();
  }

  //Route
  editRoute = async () => {
    const route = this.state.route;
    const {
      history: { push }
    } = this.props;

    await HTTP.put(`/routes/${route.id}`, route)
      .then(response => {
        notify.show("Route edited.", "success", 3000);
      })
      .catch(function(error) {
        notify.show("Error uploading route.", "error", 3000);
      });

    if (this.fileInput.current.files.length > 0) {
      this.uploadGPX();
    } else push("/routes");
  };

  //ImagesUploadObject
  uploadImageObjects = () => {
    const route = this.state.imRoute;
    const imageObjects = this.state.imagesUploadObject;
    let thisID;

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
  };

  //ImagesUpload (Image files)
  uploadImage = async (id, index) => {
    const routeId = this.state.imRoute.id;
    var formData = new FormData(); // FormData images
    formData.append(
      "file",
      this.state.imagesUpload[index],
      "route" + routeId + "Image" + id + ".jpg"
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
    const id = this.state.route.id;
    const {
      history: { push }
    } = this.props;
    var formData = new FormData(); // FormData images

    formData.append("file", file, "route" + id + "pathFile.gpx");

    await HTTP.put(`routes/uploadfiles/${id}`, formData, {
      "Content-Type": "multipart/form-data"
    })
      .then(function(response) {
        push("/routes");
        notify.show("Route successfully created", "success", 3000);
      })
      .catch(function(error) {
        notify.show("Error uploading image file", "error", 3000);
      });
  };

  /////// GET AERODROMES ///////
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

  /////// IMAGES ///////

  deleteImgObject(id) {
    HTTP.delete(`images/${id}`)
      .then(function(response) {
        notify.show("Image removed", "success");
      })
      .catch(function(error) {
        notify.show("Image cannot be removed", "error");
      });
  }

  removeImage(index) {
    if (this.state.route.images[index]) {
      let image = this.state.route.images[index];
      let showArray = this.state.imagesShow;
      let routeImages = this.state.route.images;
      routeImages.splice(index, 1); // Image deleted from route
      showArray.splice(index, 1); // Image deleted from show array
      this.setState({ imagesShow: showArray });

      this.deleteImgObject(image.id); // Delete image from DB
      console.log("Removing image >> ", image.id, image);
      console.log("Imagen de ruta, index: ", index);
    } else {
      console.log("Nueva imagen, index: ", index);
    }
  }

  showImages() {
    let imagesShow = [];

    for (let index = 0; index < 6; index++) {
      let source;
      let isDisabled;

      if (this.state.imagesShow[index]) {
        source = this.state.imagesShow[index];
        isDisabled = true;
      } else {
        source = "/images/defaultPic.jpg";
        isDisabled = false;
      }

      imagesShow.push(
        <Col key={index}>
          <Image
            onClick={this.addImageOpenModal}
            className="routeImage"
            src={source}
            alt="image"
            rounded
          />
          <h6
            style={{ display: isDisabled ? "block" : "none" }}
            className="removeImageText"
            onClick={() => this.removeImage(index)}
          >
            remove
          </h6>
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

  /////// MODAL ///////
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
          <Button
            variant="new"
            className="imgModalButtons"
            onClick={this.handleCloseModal}
          >
            Cancel
          </Button>
          <Button
            variant="new"
            className="imgModalButtons"
            disabled={false}
            onClick={this.handleSaveImage}
          >
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
    let path = this.state.image.path + 1;

    this.setState({
      modalShow: false,
      imagesUploadObject: imageObjArray,
      newImage: false,
      image: {
        ...this.state.image,
        path
      }
    });
    imageObjArray.push(this.state.image);
  };

  showState = () => {
    console.log("Files >>> ", this.state.imagesUpload);
    console.log("Objects >>> ", this.state.imagesUploadObject);
    console.log("Show >>> ", this.state.imagesShow);
    console.log("Route >>> ", this.state.route);
  };

  addImageOpenModal = () => {
    if (this.state.imagesUpload.length === 6) {
      notify.show("You can't upload more than 6 images.", "error", 3000);
    } else this.setState({ modalShow: true });
  };

  /////// FORM DATA ///////

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

  /////// RENDER ///////
  renderRouteForm() {
    let route = this.state.route;

    return (
      <Form onSubmit={this.handleSubmitEdit}>
        <Row>
          <Col>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                defaultValue={route.name}
                placeholder="Name"
                type="text"
                name="name"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group as={Col} controlId="formGridGpxFile">
              <Form.Label>Edit GPX file</Form.Label>
              <Form.Control
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
                defaultValue={route.takeoffAerodrome.name}
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
                defaultValue={route.landingAerodrome.name}
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
              <Form.Label>Images associated with your route</Form.Label>{" "}
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
                defaultValue={route.description}
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
    if (this.state.route) {
      return (
        <div className="container">
          {this.uploadImageModal()}
          <h2 className="tittle">
            Edit route
            <Button variant="back" onClick={this.goBack}>
              Back
            </Button>
          </h2>
          <hr />
          {this.renderRouteForm()}
        </div>
      );
    } else {
      return (
        <div className="container">
          <h2 className="tittle">
            Edit route
            <Button variant="back" onClick={this.goBack}>
              Back
            </Button>
          </h2>
          <hr />
          <div className="loader">
            <Loader
              as="span"
              type="Plane"
              color="#6b6630"
              height={20}
              width={20}
            />
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    aerodromes: state.aerod.aerodromes,
    login: state.auth.login
  };
}

export default connect(mapStateToProps)(RouteEdit);
