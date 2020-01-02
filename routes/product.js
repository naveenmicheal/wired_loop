const express = require('express')
const router = express.Router()
const Joi = require('@hapi/joi');
const mongoose = require('mongoose')
const productmodel = require('../models/productmodel');

// JOI validation
const product_schema = Joi.object().keys({
    name:Joi.string().min(2).max(100).trim().required(),
    product_id:Joi.string().min(2).max(100).trim().required(),
    tags:Joi.array().min(1).max(10).required(),
    price:Joi.number().required(),
    quantity:Joi.number().required(),
    media:Joi.array().max(10),
    info:Joi.string().min(10).max(10000).trim().required(),
});

router.get('/', (req, res)=>{
	productmodel.find({},(err,result)=>{
		// err ? console.log(err) : console.log(result)
		if(err){
			console.log(err)
			return
		}
		else{
			console.log(result);
			res.json(result)
		}
	})
})

router.post('/add',(req,res)=>{
	const new_product = {
	name:req.body.name,
    product_id:req.body.product_id,
    tags:req.body.tags,
    price:req.body.price,	
    quantity:req.body.quantity,
    media:req.body.media,
    info:req.body.info
	}

	const validate = product_schema.validate(new_product)
	// console.log(validate.error)
	if (validate.error == null){
		console.log(new_product)
		const new_product_obj = new productmodel(new_product)
		new_product_obj.save((err, result)=>{
			if (err){
				res.json({err})
			}
			else{
				res.json(result)
			}
		})
	}
	else{
		res.json(validate.error)
	}
	// res.json("DONE")
})


module.exports = router