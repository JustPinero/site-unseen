var express = require('express');
var router = express.Router();
const db = require("../db");

/* GET all pods  */
router.get('/', async(req,res)=>{
	try {
		const allPods = await db.query(
		`SELECT * FROM pods`
	);
	res.json(allPods.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
		throw error
	}
});

/* GET all available pods */
router.get('/available', async(req,res)=>{
	try {
		const allAvailablePods = await db.query(
		`SELECT * FROM pods WHERE occupied = $1`,[false]
		);
		const data = allAvailablePods.rows;
		res.json(data);
	} catch (error) {
		console.log("ERROR:  ", error.message)
		throw error
	}
});

/* GET POD COUNTS */
router.get('/count', async(req,res)=>{
	try {
		const occupiedPodCountResults = await db.query(
		`SELECT COUNT(*) as occupied_pod_count FROM pods WHERE occupied = $1`,[true]
		);
		const availablePodCountResults = await db.query(
			`SELECT COUNT(*) as available_pod_count FROM pods WHERE occupied = $1`,[false]
		);
		const totalPodCountResults = await db.query(
			`SELECT COUNT(*) as total_pod_count FROM pods`
		);
		const data = {
			occupiedPodCount: occupiedPodCountResults.rows,
			availablePodCount: availablePodCountResults.rows,
			totalPodCount: totalPodCountResults.rows
		}
		res.json(data);
	} catch (error) {
		console.log("ERROR:  ", error.message)
		throw error
	}
});

/* GET POD BY ID */
router.get('/:id', async(req,res)=>{
	try {
    const {id} = req.params
		const pod = await db.query(
		`SELECT * FROM pods where id=$1`,[id]
	);
	const data = pod.rows;
	res.json(data);
	} catch (error) {
		console.log("ERROR:  ", error.message)
		throw error
	}
});

/* ADD POD */

router.post('/generate/:count', async(req, res)=>{
	try {
		const {count} = req.params
		console.log("POD GENERATION:  ", count)
		for(let i=0; i< count; i++ ){
			console.log(" IN THE LOOP")
			await db.query(
			`insert into pods (occupied, occupant_id) VALUES ($1, $2 )`, [false, null]
			);
		res.status(200);
	}
	} catch (error) {
		console.log("ERROR:  ", error.message)
		throw error
	}
});

/* UPDATE POD BY ID */
router.put('/:id', async(req,res)=>{
	try {
		const {id} = req.params
		const {status, occupant_id} =req.body;
		await db.query(
		`UPDATE pods SET occupied=$1, occupant_id=$2 WHERE id=$3`, [occupied, occupant_id, id]
	);
	res.status(200);
	} catch (error) {
		console.log("ERROR:  ", error.message)
		throw error
	}
});



/* DELETE selected number of pods */
router.delete('/remove/:podcount', async(req,res)=>{
	try {
		const {podcount} = req.params
		await db.query(
		`	DELETE FROM pods
		WHERE id IN (
		SELECT id
		FROM pods
		LIMIT $1
	);`, [podcount]
	);
	res.status(200);
	} catch (error) {
		console.log("ERROR:  ", error.message)
		throw error
	}
});

/* DELETE All pods */
router.delete('/removeall', async(req,res)=>{
	try {
		await db.query(
		`DELETE FROM pods `
	);
	res.status(200);
  res.json({message:`DELETED ALL pods`})
	} catch (error) {
		console.log("ERROR:  ", error.message)
		throw error
	}
});

module.exports = router;