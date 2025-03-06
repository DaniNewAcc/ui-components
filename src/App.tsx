import { Button } from "../lib";

function App() {
  return (
    <>
      <div className="ui-my-12 ui-flex ui-items-center ui-justify-center ui-gap-8">
        <Button variant="default" size="sm" rounded="default">
          Click
        </Button>
        <Button variant="default" size="md" rounded="default">
          Click
        </Button>
        <Button disabled variant="default" size="lg" rounded="default">
          Click
        </Button>
        <Button variant="outlined" size="sm" rounded="default">
          Click
        </Button>
        <Button as="btn" variant="outlined" size="md" rounded="default">
          Click
        </Button>
        <Button variant="outlined" size="lg" rounded="default">
          Click
        </Button>
        <Button variant="transparent" size="sm" rounded="default">
          Click
        </Button>
        <Button variant="transparent" size="md" rounded="default">
          Click
        </Button>
        <Button variant="transparent" size="lg" rounded="default">
          Click
        </Button>
      </div>
      <div className="ui-flex ui-items-center ui-justify-center ui-gap-8">
        <div className="ui-flex ui-items-center ui-gap-4">
          <Button as="icon" variant="default" size="sm" rounded="default">
            +
          </Button>
          <Button as="icon" variant="default" size="md" rounded="default">
            +
          </Button>
          <Button as="icon" variant="default" size="lg" rounded="default">
            +
          </Button>
        </div>
        <div className="ui-flex ui-items-center ui-gap-4">
          <Button as="icon" variant="outlined" size="sm" rounded="default">
            +
          </Button>
          <Button as="icon" variant="outlined" size="md" rounded="default">
            +
          </Button>
          <Button as="icon" variant="outlined" size="lg" rounded="default">
            +
          </Button>
        </div>
        <div className="ui-flex ui-items-center ui-gap-4">
          <Button as="icon" variant="transparent" size="sm" rounded="default">
            +
          </Button>
          <Button as="icon" variant="transparent" size="md" rounded="default">
            +
          </Button>
          <Button as="icon" variant="transparent" size="lg" rounded="default">
            +
          </Button>
        </div>
        <div className="ui-flex ui-items-center ui-gap-4">
          <Button as="icon" variant="default" size="sm" rounded="full">
            +
          </Button>
          <Button as="icon" variant="default" size="md" rounded="full">
            +
          </Button>
          <Button as="icon" variant="default" size="lg" rounded="full">
            +
          </Button>
        </div>
        <div className="ui-flex ui-items-center ui-gap-4">
          <Button as="icon" variant="outlined" size="sm" rounded="full">
            +
          </Button>
          <Button as="icon" variant="outlined" size="md" rounded="full">
            +
          </Button>
          <Button as="icon" variant="outlined" size="lg" rounded="full">
            +
          </Button>
        </div>
        <div className="ui-flex ui-items-center ui-gap-4">
          <Button as="icon" variant="transparent" size="sm" rounded="full">
            +
          </Button>
          <Button as="icon" variant="transparent" size="md" rounded="full">
            +
          </Button>
          <Button as="icon" variant="transparent" size="lg" rounded="full">
            +
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
