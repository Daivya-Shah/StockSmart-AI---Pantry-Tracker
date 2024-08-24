'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
  InputAdornment,
  AppBar,
  Toolbar,
  Container,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { firestore } from '@/firebase';
import {
  collection,
  doc, 
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; 
import { useRouter } from 'next/navigation';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '600px',
  height: '70vh', 
  overflowY: 'auto', 
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState('');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const router = useRouter();



  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);



  const addItem = async (item, quantity) => {
    if (!item) {
      alert('Item name cannot be empty.');
      return;
    }

    if (!expirationDate) {
      alert('Please select an expiration date.');
      return;
    }

    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity: currentQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: currentQuantity + quantity, expirationDate });
    } else {
      await setDoc(docRef, { quantity: quantity, expirationDate });
    }
    await updateInventory();
    setItemName('');
    setItemQuantity(1);
    setExpirationDate('');
    handleClose();
  };



  const incrementItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity, expirationDate } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1, expirationDate });
    }
    await updateInventory();
  };



  const decrementItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity, expirationDate } = docSnap.data();
      if (quantity > 1) {
        await setDoc(docRef, { quantity: quantity - 1, expirationDate });
      } else {
        await deleteDoc(docRef);
      }
    }
    await updateInventory();
  };



  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };



  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  const handleOpenAiModal = async () => {
    try {
      const response = await fetch('/api/getRecipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inventoryItems: inventory }),
      });
      const data = await response.json();
      setRecipes(data.recipes);
      setAiModalOpen(true);
    } catch (error) {
      alert('Failed to fetch recipes');
      console.error(error);
    }
  };



  const handleCloseAiModal = () => setAiModalOpen(false);



  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const EXPIRING_SOON_DAYS = 7;
  const expiringItems = inventory.filter((item) => {
      const expirationDate = new Date(item.expirationDate);
      const currentDate = new Date();
      const diffTime = expirationDate - currentDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= EXPIRING_SOON_DAYS && diffDays >= 0;
    })
    .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));



  const lowQuantityItems = inventory.filter(item => item.quantity < 5);



  return (
    <Box>
      {/* Top AppBar */}
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            StockSmart AI 
          </Typography>
          {/* Home Page Button */}
          <Button color="inherit" onClick={() => router.push('/')}>
            Home Page
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 10 }}>
        {/* Search Bar */}
        <TextField
          placeholder="Search Inventory"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '100%', mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Add New Item
            </Button>
            <Button
              variant="contained"
              color="error" // Red button
              startIcon={<AutoAwesomeIcon style={{ color: 'white' }} />} // White AutoAwesome icon
              onClick={handleOpenAiModal}
            >
              Find Recipes
            </Button>
          </Stack>
        </Box>

        {/* Left and Right Columns */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
          }}
        >
          {/* Left Section: Inventory List (75% width on desktop, 100% on mobile) */}
          <Box sx={{ width: { xs: '100%', md: '75%' } }}>
            {/* Inventory List */}
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              sx={{
                width: '100%',
              }}
            >
              {filteredInventory.map(({ name, quantity, expirationDate }) => (
                <Card
                  key={name}
                  elevation={3}
                  sx={{
                    flex: '1 1 calc(33.333% - 16px)', // 3 items per row with space between
                    minWidth: '300px', // Ensure a minimum width
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h5">
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Expires on: {expirationDate}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography
                          variant="h6"
                          sx={{
                            backgroundColor: quantity > 5 ? '#1976d2' : '#d32f2f',
                            color: 'white',
                            borderRadius: '50%',
                            padding: '20px',
                            width: '25px',
                            height: '25px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '10px',
                          }}
                        >
                          {quantity}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => incrementItem(name)}>
                            <AddIcon />
                          </IconButton>
                          <IconButton color="secondary" onClick={() => decrementItem(name)}>
                            <RemoveIcon />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => removeItem(name)}
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Right Section: Expiring Soon & Low Quantity (25% width on desktop, 100% on mobile) */}
          <Box sx={{ width: { xs: '100%', md: '25%' } }}>
            {/* Expiring Soon Section */}
            <Typography variant="h6" mb={2}>
              Expiring Soon
            </Typography>
            {expiringItems.length > 0 ? (
              expiringItems.map(({ name, expirationDate }) => (
                <Card key={name} elevation={3} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Expires on: {expirationDate}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No items expiring soon.</Typography>
            )}

            {/* Low Quantity Section */}
            <Typography variant="h6" mt={2} mb={2}>
              Low Quantity 
            </Typography>
            {lowQuantityItems.length > 0 ? (
              lowQuantityItems.map(({ name, quantity }) => (
                <Card key={name} elevation={3} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Quantity: {quantity}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No low quantity items.</Typography>
            )}
          </Box>
        </Box>
      </Container>

      {/* StockSmartAI Modal */}
      <Modal
        open={aiModalOpen}
        onClose={handleCloseAiModal}
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-description"
      >
        {/* ...modalStyle is written only when you want to add additional properties apart from those stored in the modelStyle object */}
        <Box sx={modalStyle}> 
          <Typography id="ai-modal-title" variant="h6" mb={2}>
            StockSmartAI&#39;s Recommended Recipes
          </Typography>
          {recipes ? (
            <Typography id="ai-modal-description" variant="body1">
              {recipes.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </Typography>
          ) : (
            <Typography>No recipes found.</Typography>
          )}
        </Box>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6">
            Add New Item
          </Typography>
          <Stack spacing={2}>
            <TextField
              id="item-name"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="item-quantity"
              label="Quantity"
              variant="outlined"
              type="number"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
            />
            <TextField
              id="item-expiration"
              label="Expiration Date"
              variant="outlined"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
            <Button variant="contained" onClick={() => addItem(itemName, itemQuantity)}>
              Add Item
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}