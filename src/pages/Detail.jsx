import React, { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../context/Firebase";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';

const BookDetail=()=>{
    const params=useParams();
    const firebase=useFirebase();
    const [data,setData]=useState(null);
    const [url,setUrl]=useState(null);
    const [qty,setQty]=useState(1);

    useEffect(()=>{
       firebase.getBookById(params.bookId).then((value) => {
        setData(value.data());
       })
    },[]);
    
    useEffect(()=>{
        if(data){
            const imageURL=data.imageURL;
            firebase.getImageURL(imageURL).then((url)=>setUrl(url));
        }
    },[data]);

    const placeOrder=async ()=>{
        await firebase.placeOrder(params.bookId,qty);
    }
    if(data==null){
        return <h1>Loading...</h1>
    }
    return (
    <div className="container mt-5">
    <h1> {data.name}</h1>
          <img src={url} width='50%' style={{borderRadius:'10px'}}/>
          <h1>Details</h1>
          <p>Price Rs: {data.price}</p>
          <p>ISBN Number:{data.isbn}</p>
          <h1>Owner Details</h1>
          <p>Name:{data.displayName}</p>
          <p>Email:{data.userEmail}</p>
          <Form.Group className="mb-3" controlId="formbasicPassword">
             <Form.Label>Qty</Form.Label>
             <Form.Control onChange={(e)=>setQty(e.target.value)} 
             value={qty} type="Number" placeholder="Enter Quantity"/>
          </Form.Group>
          <Button onClick={placeOrder} variant="success">Buy Now</Button>
    </div>
    )
};

export default BookDetail;