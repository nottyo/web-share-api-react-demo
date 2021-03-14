import React, { ChangeEvent, Component } from 'react';
import { Button, Col, Container, Form, FormControl, InputGroup, Row } from 'react-bootstrap';

type ShareState = {
  isShareAPISupported: boolean;
  isFileSharingSupported: boolean;
  check: {
    title: boolean;
    text: boolean;
    url: boolean;
    imageUrl: boolean;
  },
  content: {
    title: string;
    text: string;
    url: string;
    imageUrl: File | null;
  }
}

type ShareProps = {}

export default class Share extends Component<ShareProps, ShareState> {
  constructor(props: ShareProps) {
    super(props);
    const { navigator } = window as any;
    const testFile = new File([""], 'test-file.jpg', { type: 'image/jpg'});
    const checkInit = {
      title: false,
      text: false,
      url: false,
      imageUrl: false,
    };
    const contentInit = {
      title: '',
      text: '',
      url: window.location.href,
      imageUrl: null,
    }
    if (navigator.share) {
      if (navigator.canShare && navigator.canShare({ files: [testFile] })) {
        this.state = {
          isShareAPISupported: true,
          isFileSharingSupported: true,
          check: checkInit,
          content: contentInit,
        };
      } else {
        this.state = {
          isShareAPISupported: true,
          isFileSharingSupported: false,
          check: checkInit,
          content: contentInit,
        };
      }
    } else {
      this.state = {
        isShareAPISupported: false,
        isFileSharingSupported: false,
        check: checkInit,
        content: contentInit,
      };
    }
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const { check } = this.state;
    if (target.name === 'share-title-checkbox') {
      check.title = isChecked;
      this.setState({ check });
    } else if (target.name === 'share-text-checkbox') {
      check.text = isChecked;
      this.setState({ check });
    } else if (target.name === 'share-imageUrl-checkbox') {
      check.imageUrl = isChecked;
      this.setState({ check });
    }
  }

  async handleShareClick() {
    const { navigator } = window as any;
    console.log('current state', this.state);
    const { content } = this.state;
    try {
      if (content.imageUrl) {
        await navigator.share({
          files: [content.imageUrl],
          title: content.title,
          text: content.text,
        });
      } else {
        await navigator.share({
          title: content.title,
          text: content.text,
        });
      }
      console.log('Share Success!');
    } catch (error) {
      console.error('Share Error!', error.message);
    }
  }

  async convertUrlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    return file;
  }

  async handleInputChange(event: ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    const { content } = this.state;
    if (name === 'title') {
      content.title = value;
      this.setState({ content });
    } else if (name === 'text') {
      content.text = value;
      this.setState({ content });
    } else if (name === 'imageUrl') {
      content.imageUrl = await this.convertUrlToFile(value);
    }
  }

  renderShareUI() {
    const { isShareAPISupported, isFileSharingSupported } = this.state;
    if (isShareAPISupported) {
      return (
        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Checkbox name="share-title-checkbox" onChange={this.handleCheckboxChange} />
            </InputGroup.Prepend>
            <FormControl type="text" placeholder="Enter Share Title" name="title" disabled={!this.state.check.title} onChange={this.handleInputChange} />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Checkbox name="share-text-checkbox" onChange={this.handleCheckboxChange} />
            </InputGroup.Prepend>
            <FormControl placeholder="Enter Share Text" disabled={!this.state.check.text} name='text' onChange={this.handleInputChange} />
          </InputGroup>
          { isFileSharingSupported &&
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Checkbox name="share-imageUrl-checkbox" onChange={this.handleCheckboxChange} />
              </InputGroup.Prepend>
              <FormControl placeholder="Enter Share Image URL" disabled={!this.state.check.imageUrl} name="imageUrl" onChange={this.handleInputChange} />
            </InputGroup>
          }
          <Button variant="primary" onClick={this.handleShareClick}>Share</Button>
        </Form>
      );
    } else {
      return (
        <h2>Sorry, your browser does not support Web Share API</h2>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col><h3>Web Share API Demo</h3></Col>
          </Row>
          <Row>
            <Col>{this.renderShareUI()}</Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}