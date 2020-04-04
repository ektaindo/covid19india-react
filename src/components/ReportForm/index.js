import React, {useState, useEffect} from 'react';
import Modal from 'react-modal';
import {PlusCircle, XCircle} from 'react-feather';
import axios from 'axios';

import './styles.scss';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

const categories = ['Confirmed', 'Active', 'Recovered', 'Deceased'];

const getSelectedElement = (arrayList) => {
  const arr =
    arrayList.length > 0 &&
    arrayList.map((item, i) => {
      return (
        <option key={`key_${i}`} value={item}>
          {item}
        </option>
      );
    });
  return arr;
};

function ReportCaseForm() {
  const today = new Date().toJSON().slice(0, 10);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState({
    name: '',
    age: '',
  });
  const [districts, setDistricts] = useState({});
  const [category, setCategory] = useState(categories[0]);
  const [tehsil, setTehsilName] = useState('');
  const [village, setVillage] = useState('');
  const [date, setDate] = useState(today);
  const [errors, setError] = useState({});

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleInput(event) {
    event.preventDefault();
    handleValidation();
    const name = event.target.name;
    const property = event.target.value;
    const formAttribute = Object.assign({}, value);
    formAttribute[name] = property;
    setValue({...formAttribute});
  }

  const handleSubmit = () => {
    if (handleValidation()) {
      addPatientName();
      setValue({});
      setError({});
      closeModal();
    }
  };

  useEffect(() => {
    getDistrictData();
  }, {});

  const getDistrictData = () => {
    axios
      .get('https://coronaquit.web.app/maps/kushinagar.json')
      .then((response) => {
        const defaultTehsil = Object.keys(response.data)[0];
        const defaultVillage = Object.values(response.data[defaultTehsil])[0];
        setDistricts(response.data);
        setTehsilName(defaultTehsil);
        setVillage(defaultVillage);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addPatientName = () => {
    const params = {
      ...value,
      village,
      tehsil,
      category,
      date,
    };
    axios.post(
      'https://coronaquit.web.app/addCovidPatient',
      params
    );
  };

  function saveChanges(funcName, e) {
    const idx = e.target.selectedIndex;
    const dataset = e.target.options[idx].value;
    funcName === 'isCategory'
      ? setCategory(dataset)
      : funcName === 'isDistrict'
      ? setTehsilName(dataset)
      : setVillage(dataset);
  }

  const handleValidation = () => {
    const errors = {};
    let formIsValid = true;
    if (!value['name']) {
      formIsValid = false;
      errors['name'] = 'Please enter your name';
    }
    if (!value['age']) {
      formIsValid = false;
      errors['age'] = 'please enter your age';
    }
    setError(errors);
    return formIsValid;
  };

  return (
    <div className="plus-icon-wrap">
      <PlusCircle onClick={openModal} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        id="reportForm"
      >
        <div className="close-icon">
          <XCircle onClick={closeModal} />
        </div>
        <h2>Report Corona Case near you</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="form-input-wrap">
            <label className="field-wrap" htmlFor="name">
              <div className="text-name">Name</div>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleInput}
                placeholder="Enter the Name"
              />
            </label>
            <div className="error-text">{errors.name}</div>
            <label className="field-wrap" htmlFor="age">
              <div className="text-name">Age</div>
              <input
                type="number"
                id="age"
                name="age"
                onChange={handleInput}
                placeholder="Enter the age"
              />
            </label>
            <div className="error-text">{errors.age}</div>

            <label className="field-wrap" htmlFor="date">
              <div className="text-name">Date</div>
              <input
                type="date"
                id="date"
                name="date"
                onChange={(e) => setDate(e.target.value)}
                max={today}
                defaultValue={date}
              />
            </label>
            <label className="field-wrap select-wrap" htmlFor="category">
              <div className="text-name">Category</div>
              <select
                onChange={(e) => saveChanges('isCategory', e)}
                placeholder="select any category"
              >
                {getSelectedElement(categories)}
              </select>
            </label>
            <label className="field-wrap select-wrap" htmlFor="district">
              <div className="text-name">Tehsil</div>
              <select onChange={(e) => saveChanges('isDistrict', e)}>
                {getSelectedElement(Object.keys(districts))}
              </select>
            </label>
            {!!tehsil && (
              <label className="field-wrap select-wrap" htmlFor="village">
                <div className="text-name">Village</div>
                <select onChange={(e) => saveChanges('isVillage', e)}>
                  {getSelectedElement(Object.values(districts[tehsil]))}
                </select>
              </label>
            )}
            <button className="submit-btn" onClick={handleValidation}>
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ReportCaseForm;
