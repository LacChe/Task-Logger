import React, { useState } from 'react'
import { useStateContext } from '../utils/stateContext.js';
import { client, urlFor } from '../utils/client.js';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const CreateCategory = () => {
    const navigate = useNavigate();

    const { id, name, hex, iconref } = useParams();

    const { userData, setCategories, iconData } = useStateContext();

    const [categoryName, setCategoryName] = useState(name);
    const [categoryColor, setCategoryColor] = useState(`#${hex}`);
    const [categoryIcon, setCategoryIcon] = useState(iconData?.filter((item) => item._id===iconref)[0]);

    const [errorText, setErrorText] = useState('');

    const submit = () => {
        if(!categoryName){
            setErrorText('Please input a name.');
            return;
        }
        if(!categoryColor){
            setErrorText('Please choose a color.');
            return;
        }
        if(!categoryIcon){
            setErrorText('Please choose an icon.');
            return;
        }
        if(!id){
          const doc = {
            _type: 'category',
            name: categoryName,
            user: {
                _type: 'reference',
                _ref: `${userData[0]._id}`
            },
            color: {
                _type: "color",
                hex: `${categoryColor}`
            },
            icon: {
                _type: 'reference',
                _ref: `${categoryIcon._id}`
              }
          }
          client.create(doc)
          .then((res) => {
            setCategories((prev) => [res].concat(prev));
            navigate('/profile');
          })
        } else {
            const doc = {
              _id: id,
              _type: 'category',
              name: categoryName,
              user: {
                  _type: 'reference',
                  _ref: `${userData[0]._id}`
              },
              color: {
                  _type: "color",
                  hex: `${categoryColor}`
              },
              icon: {
                  _type: 'reference',
                  _ref: `${categoryIcon._id}`
                }
            }
            client.createOrReplace(doc)
            .then((res) => {
              setCategories((prev) => prev.map((item) => item._id === res._id ? res : item));
              navigate('/profile');
            })
        }
    }
    
  return (
    <div className='create-item-main'>
        <h1>Create a Category</h1>
        <div className='create-item-text-input'>
            <p>Name:</p>
            <input type='text' value={categoryName} onChange={(e) => setCategoryName(e.target.value)}></input>
        </div>
        <div className='create-item-color-input'>
            <p>Choose a Color:</p>
            <input type='color' value={categoryColor} onChange={(e) => setCategoryColor(e.target.value)}></input>
        </div>
        <p>Choose a Default Icon:</p>
        <div className='create-item-icon-list'>
            {iconData?.map((item) => 
                <button style={{'backgroundColor' : `${categoryColor}`}} key={item._id} type='button' onClick={() => {setCategoryIcon(item)}}>
                    <img className='icon-image' src={urlFor(item.image)} alt='icon' />
                </button>
            )}
        </div>
        <div className='profile-item-bubble-inner' style={{'backgroundColor' : `${categoryColor}`}}>
            {categoryIcon && <img className='icon-image' src={urlFor(categoryIcon.image.asset._ref)} alt='category' />}
            <p>{categoryName}</p>
        </div>
        <button className='create-confirm-button' type='button' onClick={submit}>Confirm</button>
        <p>{errorText}</p>
    </div>
  )
}

export default CreateCategory